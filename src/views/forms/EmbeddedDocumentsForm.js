import React from 'react';
import {Card, CardHeader, CardBody, Row, Col, Button, Label, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

import {T} from '../../utils/i18nHelper';

import FileUpload from './FileUpload';
import {MAX_ATTACHMENTS} from '../../constants';
import StatefulForm from './StatefulForm';
import { notifyWarning } from '../../utils/NotifHelper';
import { iriDate } from '../../utils/DateHelper';
import GawatiViewer from 'gawati-viewer';
import { apiGetCall } from '../../api';
import '../../css/Paginator.css';

/**
 * This needs to be converted to use the baseformHOC
 */
class EmbeddedDocumentsForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            attModal: false ,
            attViewModal: false,
            attViewerComponent: ''
        }
        this.toggleAttachmentView = this.toggleAttachmentView.bind(this);
    }

    getPkg() {
        //pkgAttachments on the client strips 'value'.
        //Add it back since the server expects it.
        let pkg = {
            pkgIdentity: this.props.pkg.pkgIdentity,
            pkgAttachments : {value: this.props.pkg.pkgAttachments }
        }

        let offDate = iriDate(pkg.pkgIdentity['docOfficialDate'].value);
        pkg.pkgIdentity['docOfficialDate'].value = offDate;
        return pkg;
    }

    handleExtractAtt(e, emDoc) {
        e.preventDefault();
        if (emDoc.fileType !== '.pdf') {
            notifyWarning("Extraction is supported only for PDF files");
        } else {
            let data = { emDoc, pkg: this.getPkg() };
            this.props.handleExtract(data);
        }
    }

    handleRemoveAtt(e, emDoc) {
        e.preventDefault();
        let data = { emDoc, pkg: this.getPkg() };
        this.props.handleRemove(data);
    }

    toggleAttModal() {
        this.setState({ attModal: !this.state.attModal });
    }

    handlePreSave() {
        this.props.setSubmitting(true);
    }

    handlePostSave() {
        this.setState({ attModal: false });
        this.props.setSubmitting(false);
        this.props.reload();
    }

    handleAddMore(event) {
        const {pkgAttachments: attachments} = this.props.pkg ;
        if (attachments.length === MAX_ATTACHMENTS) {
          notifyWarning(T("Maximum number of attachments reached"));
        } else {
          event.preventDefault();
          let newAtt = {
              "index": '',
              "fileName": '',
              "showAs": '',
              "fileType": ''
          };
          this.setState({newAtt: newAtt, attModal: true});
        }
    }

    /*
    renderMetadata(form) {
      return (
        <ul className="list-inline custom-list">
          <li className="list-inline-item"><span>Title <b>{ form.docTitle.value }</b></span></li>
          <li className="list-inline-item"><span>Type <b>{ form.docType.value }</b></span></li>
          <li className="list-inline-item"><span>Language <b>{ form.docLang.value.value }</b></span></li>
          <li className="list-inline-item"><span>Document # <b>{ form.docNumber.value }</b></span></li>
          <li className="list-inline-item"><span>IRI <b>{ form.docIri.value }</b></span></li>
        </ul>
      )
    }
    */

   toggleAttachmentView() {
        this.setState({
            attViewModal: !this.state.attViewModal
        });
    }

    renderAttModal() {
        return (
            <Modal isOpen={this.state.attModal} toggle={this.toggleAttModal.bind(this)}>
            <ModalHeader>Upload New Attachment</ModalHeader>
            <ModalBody>
                <FileUpload pkg={this.props.pkg} emDoc={this.state.newAtt}
                isSubmitting={this.props.isSubmitting}
                handlePostSave={this.handlePostSave.bind(this)}
                handlePreSave={this.handlePreSave.bind(this)} />
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={this.toggleAttModal.bind(this)}>Cancel</Button>
            </ModalFooter>
            </Modal>
        )
    }
    

    renderAttachmentViewModal (emDoc, pkg) {
        const url = apiGetCall('attachment-get', {
              iri: pkg.pkgIdentity.docIri.value,
              originalFileName : emDoc.origFileName,
              index: emDoc.index
            }
            )
        return (
        <Modal isOpen={this.state.attViewModal} toggle={this.toggleAttachmentView} className={this.props.className} backdrop={this.state.backdrop}>
        <ModalHeader toggle={this.toggleAttachmentView}>{emDoc.origFileName}</ModalHeader>
        <ModalBody>
        <GawatiViewer attLink={url} format={emDoc.fileType.substring(1).toUpperCase()}/>
        </ModalBody>
        <ModalFooter>
            <Button color="secondary" onClick={this.toggleAttachmentView}>Close</Button>
        </ModalFooter>
        </Modal>
        )
    }

    renderAttachment(emDoc) {
        return(
            <FileUpload pkg={this.props.pkg} emDoc={emDoc}
            isSubmitting={this.props.isSubmitting}
            handlePostSave={this.handlePostSave.bind(this)}
            handlePreSave={this.handlePreSave.bind(this)} />
        );
    }

    renderAttachments(emDocs) {
        let attachments =
        emDocs.map((emDoc, i) => {
            return (
                <Row key={emDoc.index}>
                <Col xs="12">
                    <Card>
                    <CardHeader>
                        {i + 1}. {emDoc.showAs}
                        <Label className="float-right mb-0">
                        
                        <Button color="primary"  size="sm" className="mr-1" 
                            onClick={this.toggleAttachmentView}>View</Button>
                            {this.renderAttachmentViewModal(emDoc, this.props.pkg)}
                        <Button type="button" size="sm" className="mr-1"
                            onClick={(e) => this.handleExtractAtt(e, emDoc)} color="info" disabled={this.props.isSubmitting}>
                            <i className="fa fa-dot-circle-o"></i> Extract</Button>
                        <Button type="reset" size="sm"
                            onClick={ (e) => this.handleRemoveAtt(e, emDoc)} color="danger" disabled={this.props.isSubmitting}>
                            <i className="fa fa-minus-circle"></i> Remove</Button>
                        </Label>
                    </CardHeader>
                    <CardBody>
                    {this.renderAttachment(emDoc)}
                    </CardBody>
                    </Card>
                </Col>
                </Row>
            );
        });
        return attachments;
    }

    renderAttForm = () => {
        //const {mode} = this.props;
        const {pkgAttachments: attachments} = this.props.pkg ;
        return (
            <div >
                <Card className="bg-white text-right embedded-form-action">
                    <CardBody className="pt-0 pb-0">
                    <Button type="button" onClick={this.handleAddMore.bind(this)}  name="btn" size="sm" color="primary" ><i className="fa fa-plus"></i> Add File</Button>
                    </CardBody>
                </Card>        
                <StatefulForm encType="multipart/form-data" ref="docsForm" noValidate>
                <Card>
                    <CardBody>
                        { 
                            attachments.length === 0 ?
                            T("There are no file attachments yet, you can use Add File to add an attachment") :
                            this.renderAttachments(attachments)
                        }
                        {this.renderAttModal()}
                    </CardBody>
                </Card>
                </StatefulForm>
            </div>
        );
    }

    render = () => {
        return this.renderAttForm();
    }
  
};

export default EmbeddedDocumentsForm;