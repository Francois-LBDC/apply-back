const Application = require('../models/application');
const Action = require('../models/action');
const Company = require('../models/company');
const CoverLetter = require('../models/coverLetter');


const applicationController = {
    findAll : async (request, response) => { 
        const userId = request.user.id;
        try {
            const applications = await Application.findAll(userId);
            response.json(applications);
            } catch(error) {
                console.trace(error);
            }
    },

   findOne : async (request, response) => {
        const userId = request.user.id;
        const applicationId = parseInt(request.params.applicationId, 10);
        try {
            const application = await Application.findOne(userId, applicationId);
            if (!application.id) {
                response.status(404).send('The application does not exist');
            } else {
                const actions = await Action.findAllActionsOfApplication(applicationId);
                const data = {
                    application : application,
                    actions : actions
                }
                response.json(data);
            }  
        } catch(error) {
            console.trace(error);
        }
   },

   create : async (request, response) => {
        const data = request.body;
        const userId = request.user.id;
        let cover_letter_id = null;
        let company_id = null;
        //trim text and transform all empty strings into null
        for (const line in data) {
            if(typeof data[line] == 'string') {
                data[line] = data[line].trim();
            }
            if (data[line] === '') {
                data[line] = null;
            }
        }

        

        //check if there are additionnal actions
        
        if (!(data.applicationActions.length == 0)) {
        //check the date status, if it is different than 1, remove the applicationActions (they should not be enterred if the status is other than "I have applied")
            if (!(data.status ==1)) {
                data.applicationActions = [];
            // if it is equal to 1 compare the dates to application date(not possible in joi with current data structure)
            } else {
                for (action of data.applicationActions) {
                    if (action.actionDate < data.date) {
                        return response.status(400).json(`Une date de relance ou d'entretien ne peut être antérieure à la date de candidature`);
                    }
                }
            }
        }
        try {
        // manages company presence or not in the request and returns a company_id (a new one, an old one or null)
        if (!(data.company == null)) {
            const company = await Company.findWithName(data.company);
            // If this company does not exist in the database
            if (!company.id) {
                const newCompanyData = {
                    name: data.company
                };
                const newCompany = new Company(newCompanyData);
                await newCompany.save(newCompany);

                company_id = newCompany.id;
            //if it exists 
            } else {
                company_id = company.id;
            }
        } else {
            company_id = null ;
        }
        //cover_letter management 
        if (data.cover_letter !== null) {
            const newCoverLetterData = {
                content : data.cover_letter
            };
            const newCoverLetter = new CoverLetter(newCoverLetterData);
            await newCoverLetter.save(newCoverLetter);

            cover_letter_id = newCoverLetter.id;
        } else {
            cover_letter_id = null;
        }


        if (data.dunning_date == null) {
            data.dunning_date = null;
        }


        const applicationData =  {
            title : data.title, 
            link : data.link, 
            offer_content : data.offer_content,
            dunning_date : data.dunning_date,
            notes : data.notes, 
            location : data.location, 
            type_id : data.type_id,
            company_id : company_id,
            contract_id : data.contract,
            cover_letter_id : cover_letter_id,
            user_id : userId
        }
        const newApplication = new Application(applicationData);
        await newApplication.save(newApplication);

        // if no "main" date 
        if (data.date == null || data.status==0) {
            response.status(201).json(`Candidature n°${newApplication.id} ajoutée, sans action attachée`)
            // i have actions to add to the application
        } else {
            const createdActions = [];
            //add the main action
            const dateData = {
                title : data.dateTitle,
                date : data.date,
                action_type_id : data.status, 
                application_id : newApplication.id
            }
            const newAction = new Action(dateData);
            await newAction.save(newAction);

            createdActions.push(newAction.title);
            //if there are smaller actions
            if (!(data.applicationActions.length == 0)) {
                const applicationActionsData = {
                    date : null,
                    title : null,
                    action_type_id : null,
                    application_id : newApplication.id
                };
                for (const action of data.applicationActions) {
                    applicationActionsData.date = action.actionDate;
                    applicationActionsData.title = action.actionTitle;
                    applicationActionsData.action_type_id = action.actionType;

                    const newApplicationAction = new Action(applicationActionsData);
                    await newApplicationAction.save(newApplicationAction);

                    createdActions.push(newApplicationAction.title);
                }
                
            }
            response.status(201).json(`Candidature n°${newApplication.id} ajoutée, avec l'/les action.s ${createdActions}`)
        }


    } catch(error) {
        console.trace(error);                   
    }
   },

   modifyAll : async(request,response) => {
    const applicationData = request.body.application;
    const userId = request.user.id;
    const applicationId = parseInt(request.params.applicationId, 10);
    
    //trim text in the request for application
    for (const line in applicationData) {
        if(typeof applicationData[line] == 'string') {
            applicationData[line] = applicationData[line].trim();
        }
    }

    
    try {
        //check if need to modify notes
        if (applicationData.notes !== null) {
            //pass to null if empty string
                if (applicationData.notes == "") {
                    applicationData.notes= null;
                }
            const newNotes = await Application.modifyNotes(userId, applicationId, applicationData.notes);
            //result.notes = newNotes.notes;
        }
        // modify or not offer content
        if (applicationData.offer_content !== null) {
            if (applicationData.offer_content == "") {
                applicationData.offer_content= null;
            }
            const newOffer_content = await Application.modifyOfferContent(userId, applicationId, applicationData.offer_content);
            //result.offer_content = newOffer_content.offer_content;
        }


        if (applicationData.cover_letter_content !== null) {
        //IL FAUT VOIR SI UNE LETTRE EXISTE DEJA, SINON JE DOIS EN CREER UNE PLUTOT QUE LA MODIFIER 
        
            if (applicationData.cover_letter_id == null) {
                if (applicationData.cover_letter_content !=="") {

                    const newCoverLetterData = {
                        content : applicationData.cover_letter_content
                    };
                    const newCoverLetter = new CoverLetter(newCoverLetterData);
                    await newCoverLetter.save(newCoverLetter);

                    applicationData.cover_letter_id = newCoverLetter.id;

                    
                    await Application.modifyCoverLetterId(userId, applicationId, applicationData);
                }
            } else {
                if (applicationData.cover_letter_content =="") {
                    await CoverLetter.deleteOne(applicationData.cover_letter_id);
                } else {
                    const newCoverLetterContent = await CoverLetter.modifyCoverLetter(userId, applicationId, applicationData.cover_letter_content);
                }

            }
            //result.cover_letter = newCoverLetterContent.content;
        }

        // gestion modification title
        if (applicationData.title !== null) {
            if (applicationData.title !=="") {
                const newTitle = await Application.modifyTitle(userId, applicationId, applicationData.title.trim());
            }
        }

        // gestion modification entreprise
        if((applicationData.company !==null) || (applicationData.link !==null) || (applicationData.location !==null) || (applicationData.contract_id !==null) || (applicationData.type_id !==null) || (applicationData.dunning_date_format !==null)) {

            if ((applicationData.company !=="") && (applicationData.company !==null)) {
                const company = await Company.findWithName(applicationData.company);
                // If this company does not exist in the database
                if (!company.id) {
                    const newCompanyData = {
                        name: applicationData.company
                    };
                    const newCompany = new Company(newCompanyData);
                    await newCompany.save(newCompany);
        
                    company_id = newCompany.id;
                    //if it exists 
                } else {
                company_id = company.id;
                }
            } else {
            company_id = null ;
            }

            //link empty
            if (applicationData.link == "") {
                applicationData.link= null;
            }

            //location empty 
            if (applicationData.location == "") {
                applicationData.location= null;
            }
            

            //info null management

            await Application.modifyInfo(userId, applicationId, applicationData, company_id);
   
            // actions
        }

/* VOIR POUR LES ACTIONS A AJOUTER COMMENT ELLES S'AFFICHENT

        if (!(request.body.applicationActions.length == 0)) {
            const applicationActionsData = {
                date : null,
                title : null,
                action_type_id : null,
                application_id : applicationId
            };
            for (const action of request.body.applicationActions) {
                applicationActionsData.date = action.actionDate;
                applicationActionsData.title = action.actionTitle;
                applicationActionsData.action_type_id = action.actionType;

                const newApplicationAction = new Action(applicationActionsData);
                await newApplicationAction.save(newApplicationAction);
            }
        }
*/
        // Add new actions
        for(const action of request.body.newActions) {
            if (action.toDelete ===false){
                //there is no date key in the object, which is needed in my Action.save method so I add one
                action.title = action.title.trim();
                action.date = action.date_format;
                action.application_id = applicationId;
                const newAction = new Action(action);
                newAction.save(newAction);
            }
        }

        //remove or modify existing actions

        for(const action of request.body.actions) {
            if (action.toDelete ===true) {
                actionToDelete = new Action(action);
                await actionToDelete.deleteAction(userId, applicationId, actionToDelete)
            } else {
                action.title = action.title.trim();
                actionToModify = new Action(action);
                await actionToModify.modifyAction(actionToModify);
            }
        }
    
        // at the end send same info than details
        const application = await Application.findOne(userId, applicationId);
        const actions = await Action.findAllActionsOfApplication(applicationId);
        const data = {
            application : application,
            actions : actions
        }
        response.status(200).json(data);
    } catch(error) {
        console.trace(error);
    }
    }/*,

    
   modifyNotes : async(request,response) => {
    const userId = request.user.id;
    const applicationId = parseInt(request.params.applicationId, 10);
    const notes = request.body.notes;
    try {
        const newNotes = await Application.modifyNotes(userId, applicationId, notes);
        response.status(200).json(newNotes.notes);
    } catch(error) {
        console.trace(error);
    }
   },

   modifyOfferContent : async(request,response) => {
    const userId = request.user.id;
    const applicationId = parseInt(request.params.applicationId, 10);
    const offer_content = request.body.offer_content;
    try {
        const newOffer_content = await Application.modifyOfferContent(userId, applicationId, offer_content);
        response.status(200).json(newOffer_content.offer_content);
    } catch(error) {
        console.trace(error);
    }
   },

   modifyCoverLetter : async(request,response) => {
    const userId = request.user.id;
    const applicationId = parseInt(request.params.applicationId, 10);
    const coverLetterContent = request.body.cover_letter;
    try {
        const newCoverLetterContent = await CoverLetter.modifyCoverLetter(userId, applicationId, coverLetterContent);
        response.status(200).json(newCoverLetterContent.content);
    } catch(error) {
        console.trace(error);
    }
   },

   modifyInfo: async(request,response) => {
    const userId = request.user.id;
    const applicationId = parseInt(request.params.applicationId, 10);
    const data = request.body;
    try {
    //take care of company
    if (!(data.company == "")) {
        const company = await Company.findWithName(data.company);
        // If this company does not exist in the database
        if (!company.id) {
            const newCompanyData = {
                name: data.company
            };
            const newCompany = new Company(newCompanyData);
            await newCompany.save(newCompany);

            company_id = newCompany.id;
        //if it exists 
        } else {
            company_id = company.id;
        }
    } else {
        company_id = null ;
    }

        await Application.modifyInfo(userId, applicationId, data);
        response.status(200).json('Modification réussie');
    } catch(error) {
        console.trace(error);
    }
   },*/

}

module.exports = applicationController;