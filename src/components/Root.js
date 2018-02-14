import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import {  Container } from 'reactstrap';

import FooterNav from './FooterNav';
//import Aside from './Aside';
import TopNav from './TopNav';
import SideBar from './sidebar/SideBar';
import Breadcrumb from './Breadcrumb';
import Dashboard from '../views/Dashboard';
//import Login from '../views/pages/Login/Login';
import EditForm from '../views/forms/EditForm';

import {PropsRoute, getRoute} from '../utils/routeshelper';
import { ToastContainer } from 'react-toastify';

class Root extends React.Component {
    render() {
        const {i18n} = this.props;
        console.log(" MAGTCH PARAM ", this.props.match, getRoute("document-ident-open"));
        return (
            <div className="app">
                <PropsRoute path="*" component={ TopNav } i18n={ i18n } />
                <div className="app-body">
                <SideBar path="*" {...this.props}/>
                <main className="main">
                    <Breadcrumb />
                    <Container fluid>
                        <Switch>
                            <Route exact path="/dashboard">
                                <Redirect to="/dashboard/_lang/en" />
                            </Route>
                            <PropsRoute path={ getRoute("logged-in-root") } name="Dashboard" component={Dashboard} i18n={i18n} />

                            <PropsRoute path={ getRoute("document-ident-open") }
                                name="EditForm" component={EditForm} mode="edit" i18n={i18n} />


                            <PropsRoute path={ getRoute("document-add") } 
                                name="InputForm" component={EditForm} mode="add" i18n={i18n} />

                            <PropsRoute path={ getRoute("document-comp-open") } 
                                    name="EditCompForm" component={EditForm} mode="edit" i18n={i18n} />

                             <Redirect from="/" to="/dashboard"/>

                        </Switch>
                     </Container>
                </main>
                {/*<Aside />*/}
            </div>
            <PropsRoute path="*" component={ FooterNav } i18n={ i18n } />
            <ToastContainer />
            </div>
        );
    }
}

export default Root;
