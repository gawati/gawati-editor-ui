import React from 'react';
import {Container, Row, Col, CardGroup, Card, CardBody, Button, Input, InputGroup, InputGroupAddon} from 'reactstrap';

import {Aux} from '../../../utils/GeneralHelper';

const LoginForm = ({history, login}) => 
<Aux>
    <h1>Login</h1>
    <p className="text-muted">Sign In to your account</p>
    <InputGroup className="mb-3">
        <InputGroupAddon><i className="icon-user"></i></InputGroupAddon>
        <Input type="text" placeholder="Username"/>
    </InputGroup>
    <InputGroup className="mb-4">
        <InputGroupAddon><i className="icon-lock"></i></InputGroupAddon>
        <Input type="password" placeholder="Password"/>
    </InputGroup>
    <Row>
        <Col xs="6">
            <Button color="primary" className="px-4" onClick={()=>login(true)}>Login</Button>
        </Col>
        <Col xs="6" className="text-right">
            <Button color="link" className="px-0">Forgot password?</Button>
        </Col>
    </Row>
</Aux>
;

const SignUp = ({history}) => 
    <div>
        <h2>Sign up</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua.</p>
        <Button color="primary" className="mt-3" onClick={() => history.push("/register")} active>Register Now!</Button>
    </div>
    ;


class Login extends React.Component {
  render() {
    const {history, login} = this.props; 
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <LoginForm history={history} login={login} />
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: 44 + '%' }}>
                  <CardBody className="text-center">
                     <SignUp history={history} />
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
