import { ComponentFactoryResolver, ComponentRef, Inject, Injectable, Optional, Renderer2, Type, ViewContainerRef } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Immutable, Maybe } from "global-types";
import { pairwise, startWith } from "rxjs/operators";
import { DYNAMIC_FORM_DEFAULT_OPTIONS } from "../injection-tokens.const";
import { AllowFormStateSelectors, ControlComponent, ControlGroupComponent, DynamicControl, DynamicControlGroup, DynamicControlOptions, DynamicFormDefaultOptions, FormStateSelector, GenericAbstractControl, ValidControl, ValidControlObject } from "../interfaces";
import { _isControlGroup, _isFormStateSelector } from "../type.helpers";
import { FormStateResolver } from "./form-state.resolver";

type ControlWithSelectors<T extends DynamicControl<any, ControlComponent<any, any>> = DynamicControl<any, ControlComponent<any, any>>> = 
    Omit<T, keyof DynamicControlOptions> & AllowFormStateSelectors<DynamicControlOptions,any, ControlComponent<any, any>>

type ValidFormControl<T extends ValidControl<any>> = T extends DynamicControl<(infer V),any> ? GenericAbstractControl<V> : FormGroup;
type ValidFormComponent<T extends ValidControl<any>> = T extends DynamicControl<any,(infer Q)> ? ControlComponent<any, Q> : ControlGroupComponent<any>

@Injectable()
export class ControlComponentRenderer {
 
    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,       
        @Inject(DYNAMIC_FORM_DEFAULT_OPTIONS) @Optional() private globalOptions: Maybe<DynamicFormDefaultOptions>,
        private resolver: FormStateResolver,
        private renderer: Renderer2,
    ) { }

    renderControls(controls: ValidControlObject<any>, formGroup: FormGroup, vcRef: ViewContainerRef): void {
        for(const controlName in controls){
            const formControl = formGroup.get(controlName);
            if(formControl === null) throw Error(`No form control for control with name ${controlName} on group ${formGroup}`)
             const ref = this.renderControl(controls[controlName], formControl, vcRef);
             if(ref) this.renderer.setAttribute(ref.location.nativeElement, "data-cy", "form-"+controlName)
             ref?.instance.onControlInit?.();
        }
    }

    renderControl<C extends ValidControl<any>>(controlCfg: Immutable<C>, control: ValidFormControl<C>, vcRef: ViewContainerRef): ComponentRef<ValidFormComponent<C>> | undefined {

        const isGroup = _isControlGroup(controlCfg);

        const componentRef = isGroup ? 
            this.loadGroup(<any> controlCfg, <FormGroup> control, vcRef) :
            this.loadControl(<ControlWithSelectors> controlCfg, <FormControl><unknown> control, vcRef);  

        if(componentRef === undefined) return;

        const el = <HTMLElement> componentRef.location.nativeElement;

        if(controlCfg.controlClass$ !== undefined)
            this.setClass(el, controlCfg.controlClass$);  

        if(this.globalOptions){
            if(isGroup && this.globalOptions.groupClass) 
                this.setClass(el, this.globalOptions.groupClass);
            else if(!isGroup && this.globalOptions.controlClass)
                this.setClass(el, this.globalOptions.controlClass);
        }
        
        return <ComponentRef<ValidFormComponent<C>>> componentRef;
    }

    private loadControl(
        controlCfg: ControlWithSelectors,
        control: FormControl, 
        vcRef: ViewContainerRef
    ): ComponentRef<ControlComponent<object | null, object>> | undefined {
        if(!controlCfg.controlComponent) return;
        
        const componentRef = this.loadComponent(controlCfg.controlComponent, vcRef);

        componentRef.instance.control = control;

        componentRef.instance.viewOptionSelectors = controlCfg.viewOptions || {};

        componentRef.instance.requiredSelector = controlCfg.required$;

        return componentRef;
    }

    private loadGroup(groupCfg: Immutable<DynamicControlGroup<any, any, any>>, formGroup: FormGroup, vcRef: ViewContainerRef): ComponentRef<ControlGroupComponent<any>> {
        const groupComponent = groupCfg.groupComponent || this.globalOptions?.groupComponent;

        if(!groupComponent) throw Error("Missing control group component, Either specify in configuration or set a default component.")

        const componentRef = this.loadComponent(groupComponent, vcRef);

        componentRef.instance.config = groupCfg;

        componentRef.instance.formGroup = formGroup;

        return componentRef;   
    }

    private loadComponent<TComponent>(component: Type<TComponent>, vcRef: ViewContainerRef): ComponentRef<TComponent>{
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
        return vcRef.createComponent<TComponent>(componentFactory);
    }

    private setClass(el: HTMLElement, controlClass: string | Immutable<FormStateSelector<any, any, string | undefined, any, any>>): void {
        if(_isFormStateSelector(controlClass))
            this.resolver.resolve$(controlClass).pipe(
                startWith(undefined),
                pairwise<string | undefined>()
            ).subscribe(([prev, curr]) => {
                if(prev) this.renderer.removeClass(el, prev)
                if(curr) this.renderer.addClass(el, curr)
            }); 
        else 
            this.renderer.addClass(el, <string> controlClass)
    }

}