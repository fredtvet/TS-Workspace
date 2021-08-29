import { ApiUrl } from "@core/api-url.enum";
import { MissionDocument } from "@core/models";
import { StateMissionDocuments } from "@core/state/global-state.interfaces";
import { ValidationRules } from "@shared-app/constants/validation-rules.const";
import { _stringGen } from "cypress/support";

describe('Mission Document Form', () => {
    
    const isSubmittable = () =>  cy.getCy('submit-form').should('not.be.disabled');
    const isNotSubmittable = () => cy.getCy('submit-form').should('be.disabled');

    const mission = { id: '1', address: "new", phoneNumber: "9234", description: "desc" }

    beforeEach(() => {
        cy.intercept('POST', '**' + ApiUrl.MissionDocument, { statusCode: 204, delay: 100 }).as('createDoc');;  
        cy.login('Leder', '/oppdrag/' + mission.id + '/detaljer/dokumenter', {missions: [mission]});
    })

    it('can fill in form and create mission document', () => {  
        cy.mainFabClick();
        cy.wait(600);

        const newDoc: MissionDocument = { name: "test", fileName: "sample-document.txt" }

        isNotSubmittable();

        //Check validation rules for name
        cy.getCy('form-name','input').type(_stringGen(ValidationRules.NameMaxLength + 1));   
        cy.submitForm().getCy('form-name','mat-error').should('exist');
        isNotSubmittable();

        cy.getCy('form-name','input').clear().type(newDoc.name);   
        isNotSubmittable();

        //Check validation rules for file
        cy.getCy('form-file','input').attachFile('sample-image-1.jpg');   
        cy.submitForm().getCy('form-file','mat-error').should('exist');
        isNotSubmittable();

        cy.getCy('form-file','input').attachFile(newDoc.fileName!);   
        isSubmittable();

        //Submit and check that new doc exists in state
        cy.getCy('submit-form').click();
        cy.wait('@createDoc');
        cy.storeState<StateMissionDocuments>().then(state => {
            const doc = state.missionDocuments![0];
            expect(doc.name).to.equal(newDoc.name);
            expect(doc.fileName).to.contain("blob:");
            expect(doc.id).to.exist;
        })
    });

});