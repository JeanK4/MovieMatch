import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './Navbar.css'

function NavegationBar() {
    return (
        <Navbar expand="lg" className="bg-body-tertiary fs-4 fixed">
            <Container fluid>
                <Navbar.Brand href="/" className="text-white fs-2">m&m</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll outline-light" className='colorToggle'/>
                <Navbar.Collapse id="navbarScroll" variant="outline-light" className='navbar-collapse'>
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '300px' }}
                    >
                        <Nav.Link href="/" className="text-white">Inicio</Nav.Link>
                        <Nav.Link href="Recomendaciones" className="text-white">Generar Recomendaciones</Nav.Link>
                        <Nav.Link href="Catalogo" className="text-white">Catálogo</Nav.Link>
                        <Nav.Link href="Prueba" className="text-white">Prueba</Nav.Link>
                    </Nav>
                    <Form className="d-flex">
                        <Form.Control
                            type="search"
                            placeholder="Search"
                            className="me-2"
                            aria-label="Search"
                        />
                        <Button variant="outline-light">Search</Button>
                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavegationBar;