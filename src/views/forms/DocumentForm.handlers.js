import { notifySuccess, notifyError} from '../../utils/NotifHelper';
import axios from 'axios';

import { apiUrl } from '../../api';
import {STATE_ACTION_IS_NOT_SUBMITTING} from './DocumentForm.constants';
import {applyActionToState} from './DocumentForm.stateManager';

/** EVENT HANDLERS */
export const handleSuccess =  (data) => {
    const {success, error} = data ; 
    if (success) {
        let {code, message} = success ; 
        notifySuccess( `${code} - Document was saved ${message}`);
    }  
    if (error) {
        let {code, message} = error ;
        notifyError( `${code} - ${message} `);
    } 
};

/**
 * Makes a call to the edit api and submits the document content to be edited.
 * Returns a promise so the response can be handled further by the caller.
 * @param {object} the THIS "this" in the caller form 
 */
export const handleSubmitEdit = (THIS, data) => {
    const request = axios.post(
      apiUrl('document-edit'), {
        data: data
      }
    );
    request
      .then(
        (response) => {
          applyActionToState(THIS, {type: STATE_ACTION_IS_NOT_SUBMITTING});
          handleSuccess(response.data);
        }
      )
      .catch(
        (err) => {
          applyActionToState(THIS, {type: STATE_ACTION_IS_NOT_SUBMITTING});
          handleApiException(THIS, err);
        }
      );
    return request;         
  };

/**
 * Makes a call to the edit api and submits the document content to be edited.
 * Returns a promise so the response can be handled further by the caller.
 * @param {object} the context "this" in the caller form 
 */
export const handleSubmitAdd = (THIS, data) => {
    axios.post(
      apiUrl('document-add'), {
        data: data
      }
      )
    .then(
      (response) => {
        applyActionToState(THIS, {type: STATE_ACTION_IS_NOT_SUBMITTING});
        handleSuccess(response.data);
      }
    )
    .catch(
      (err) => {
        applyActionToState(THIS, {type: STATE_ACTION_IS_NOT_SUBMITTING});
        handleApiException(err);
      }
    );      
  }

/**
 * Makes a call to the edit api and submits the document content to be edited.
 * Returns a promise so the response can be handled further by the caller.
 * @param {object} the context "this" in the caller form 
 */
export const handleApiException = (THIS, err) => {
    console.log(" Error while adding ", err);
};

/**
 * Remove Attachment (embedded doc)
 */
export const handleRemoveAttachment = (THIS, data, postRemove) => {
    axios.post(
      apiUrl('document-remove'), {
        data: data
      }
      )
    .then(
      (response) => {
        applyActionToState(THIS, {type: STATE_ACTION_IS_NOT_SUBMITTING});
        handleSuccess(response.data);
        postRemove();
      }
    )
    .catch(
      (err) => {
        applyActionToState(THIS, {type: STATE_ACTION_IS_NOT_SUBMITTING});
        handleApiException(err);
      }
    );
}
