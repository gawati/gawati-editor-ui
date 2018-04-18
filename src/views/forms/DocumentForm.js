import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import IdentityMetadataForm from './IdentityMetadataForm';
import StdCompContainer from '../../components/general/StdCompContainer';

import {T} from '../../utils/i18nHelper';
import { isInvalidValue} from '../../utils/GeneralHelper';
import { aknExprIri, aknWorkIri, normalizeDocNumber, unknownIriComponent } from '../../utils/UriHelper';
import { iriDate, isValidDate } from '../../utils/DateHelper';
import {DocumentFormActions} from './DocumentFormActions';

import 'react-tabs/style/react-tabs.css';

/*
* Form Related configs and util functions
*/
import {
    identityInitialState,
    identityValidationSchema
} from './DocumentForm.formConfig';
import {
    loadFormWithDocument,
    loadViewWithDocument,
    setFieldValue,
    validateFormFields,
    getBreadcrumb,
} from './DocumentForm.formUtils' ;
import { applyActionToState } from './DocumentForm.handlers';
import { STATE_ACTION_RESET, STATE_ACTION_IS_SUBMITTING } from './DocumentForm.constants';

/**
 * Expects the following props
 *  
 *  - @mode ``edit`` or ``add`` or ``view``
 *  - @iri in ``edit`` or ``view`` modes expects an IRI as a prop
 */
class DocumentForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          isSubmitting: false,
          documentLoadError: false,
          mode: props.mode,
          /* 
          form has field names as state values 
          i.e. docTitle has to have a corresponding 
          <input name="docTitle" .... /> in the form
          */ 
          pkg: {
            pkgIdentity: identityInitialState(),
            pkgAttachments: []
          }
        };
        /** 
         * This provides validation of each field value using Yup
         * The validator function is declared in Yup syntax here, and
         * applied in the onChange of the field. 
         */
        this.identityValidationSchema = identityValidationSchema();
        // bindings
        //this.handleSubmit = this.handleSubmit.bind(this);
        //this.handleReset = this.handleReset.bind(this);
    }

    componentDidMount() {
        const {mode} = this.props;
        if (mode === "edit") {
            // load iri date
            loadFormWithDocument(this);
        } else if (mode === "add") {
            // add mode ... validate empty form
            validateFormFields(this);
        } else {
            // mode === view 
            loadViewWithDocument(this);  
        }
    }

    updateIriValue = () => {
        setFieldValue(this, "docIri", this.generateIRI(this.state.pkg.pkgIdentity));
    };

    handleIdentityReset = () => {
        applyActionToState(this, {type: STATE_ACTION_RESET, params: {}});
    };

    handleIdentitySubmit = (evt) => {
        applyActionToState(this, {type: STATE_ACTION_IS_SUBMITTING, params: {isSubmitting: true}});
    }

    render() {
        const breadcrumb = getBreadcrumb(this);
        const {match, mode} = this.props;
        const {lang} = match.params;
        const {pkg, isSubmitting} = this.state ;
        return (
          <StdCompContainer breadcrumb={breadcrumb}>
            <DocumentFormActions lang={lang} />
            <Tabs>
            <TabList>
              <Tab>{T("Identity")}</Tab>
              <Tab>Attachments</Tab>
              <Tab>Signature</Tab>
              <Tab>Extended Metadata</Tab>
            </TabList>
            <TabPanel>
               <IdentityMetadataForm 
                    lang={lang} 
                    mode={mode} 
                    pkg={pkg} 
                    isSubmitting={isSubmitting}
                    validationSchema={this.identityValidationSchema}
                    handleReset={this.handleIdentityReset} 
                    handleSubmit={this.handleIdentitySubmit} 
                />
            </TabPanel>
            <TabPanel>
              <h2>Any content 2</h2>
            </TabPanel>
            <TabPanel>
              <h2>Any content 2</h2>
            </TabPanel>
            <TabPanel>
              <h2>Any content 2</h2>
            </TabPanel>

          </Tabs>
        </StdCompContainer>
        );
    }

};

export default DocumentForm ; 