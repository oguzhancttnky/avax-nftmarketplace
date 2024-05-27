import React from 'react'
import {Container, Row, Col} from 'reactstrap'
import { Link } from 'react-router-dom'
import './hero-section.css'

const HeroSection = () => {
  return <section className="hero__section">
    <Container>
        <Row>
            <Col lg='6' md='6'>
                <div className='hero__content'>
                    <h2>
                        Discover rare digital art, collections and collect{" "}
                        <span>
                            sell extraordinary
                        </span>{" "}NFTs
                    </h2>
                    <p>
                    Explore our marketplace for unique digital assets. Discover rare and collectible NFTs created by artists worldwide. Whether you're a seasoned collector or a newcomer, find digital art, game items, virtual real estate, and more. Join our community to buy, sell, and uncover the next big thing in the digital world. 
                    </p>
                    <div className='hero__btns d-flex align-items-center gap-4'>
                        <button className='explore__btn d-flex align-items-center gap-2'><i class="ri-rocket-2-line"></i><Link to='/market'>Explore</Link></button>
                        <button className='create__btn d-flex align-items-center gap-2'><i class="ri-tools-line"></i><Link to='/create-nft'>Create</Link></button>
                    </div>
                </div>
            </Col>
        </Row>
    </Container>
  </section>
}

export default HeroSection