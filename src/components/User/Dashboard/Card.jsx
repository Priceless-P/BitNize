import React from 'react';
import { Card as PrimeCard } from 'primereact/card';
import { Button } from 'primereact/button';

const Card = ({ title, subTitle, body, buttonLabel='Disconnect', onButtonClick }) => {
    const header = (
        <img alt="wallet" src="/images/user/wallet.png" height={270} className="mb-0 " />
    );

    const footer = (
        <>
            <Button label={buttonLabel} icon="pi pi-check" onClick={onButtonClick} />
        </>
    );

    return (
        <div className="col-12 md:col-8 lg:col-6 ">
            <PrimeCard title={title} subTitle={subTitle} footer={footer} header={header} className="md:w-25rem surface-0">
                <p className="m-0">{body}</p>
            </PrimeCard>
        </div>
    );
};

export default Card;
