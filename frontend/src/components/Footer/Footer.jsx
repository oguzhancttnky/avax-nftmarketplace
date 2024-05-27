import React from 'react'
import { Container, Row, Col, ListGroup, ListGroupItem} from 'reactstrap'
import { Link } from 'react-router-dom'
import oboLogo from '../../assets/images/obologo.png'
import './footer.css'

const MY__ACCOUNT = [
  {
    display: 'Author Profile',
    url: '/profile'
  },
  {
    display: 'Create Item',
    url: '/create-nft'
  },
  {
    display: 'Collection',
    url: '/collections'
  },
  {
    display: 'Edit Profile',
    url: '/edit-profile'
  },
]

const RESOURCES = [
  {
    display: 'Help Center',
    url: '#'
  },
  {
    display: 'Partner',
    url: '#'
  },
  {
    display: 'Community',
    url: '#'
  },
  {
    display: 'Activity',
    url: '#'
  },
]

const COMPANY = [
  {
    display: 'About',
    url: '#'
  },
  {
    display: 'Career',
    url: '#'
  },
  {
    display: 'Ranking',
    url: '#'
  },
  {
    display: 'Contact Us',
    url: '/contact'
  },
]

const Footer = () => {
  return <footer className='footer'>
    <Container>
      <Row>
        <Col lg='3' md='6' sm='6'>
          <div className="footer-logo">
            <h2 className='d-flex gap-2 align-items-center'>
              <span>
                <img src={oboLogo} alt="oboLogo" width={100} height={62.35} />
              </span>
            </h2>
            <p>Step into the future with OBO. Create a Collection, create NFT, buy and sell and be among us on the path to the future.</p>
          </div>
        </Col>

        <Col lg='2' md='3' sm='6'>
          <h5>My Account</h5>
          <ListGroup className='list__group'>
            {
              MY__ACCOUNT.map((item, index) =>(
                <ListGroupItem key={index} className='list__item'>
                  <Link to={item.url}>
                    {item.display}
                  </Link>
                </ListGroupItem>
              ))
            }
          </ListGroup>
        </Col>

        <Col lg='2' md='3' sm='6'>
        <h5>Resources</h5>
          <ListGroup className='list__group'>
            {
              RESOURCES.map((item, index) =>(
                <ListGroupItem key={index} className='list__item'>
                  <Link to={item.url}>
                    {item.display}
                  </Link>
                </ListGroupItem>
              ))
            }
          </ListGroup>
        </Col>

        <Col lg='2' md='3' sm='6'>
        <h5>Company</h5>
          <ListGroup className='list__group'>
            {
              COMPANY.map((item, index) =>(
                <ListGroupItem key={index} className='list__item'>
                  <Link to={item.url}>
                    {item.display}
                  </Link>
                </ListGroupItem>
              ))
            }
          </ListGroup>
        </Col>

        <Col lg='3' md='6' sm='6'>
          <h5>Newsletter</h5>
          <input type='text' className='newsletter' placeholder='Email'/>
          <div className='social__links d-flex gap-3 align-items-center'>
            <span><Link to='#'><i class="ri-facebook-circle-line"></i></Link></span>
            <span><Link to='#'><i class="ri-instagram-line"></i></Link></span>
            <span><Link to='#'><i class="ri-twitter-x-line"></i></Link></span>
            <span><Link to='#'><i class="ri-youtube-line"></i></Link></span>
            <span><Link to='#'><i class="ri-telegram-line"></i></Link></span>
          </div>
        </Col>
        <Col lg='12' className='mt-4 text-center'>
            <p className='copyright'>Copyrights 2024, Developed by OBO. HUCS2024</p>
        </Col>  
      </Row>
    </Container>
  </footer>
}

export default Footer