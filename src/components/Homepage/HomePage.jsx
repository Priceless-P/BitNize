import React, { useState, useEffect } from 'react';
import Hero from './Hero/Hero';
import Content from './Content/Content';
import Navbar from './Navigation/Navbar';
import Footer from './Footer/Footer';

const HomePage = () => {
return (
<div>

<Hero />
<Content />
<Footer />
</div>

)
}

export default HomePage;