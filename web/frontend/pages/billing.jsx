
import React, {useState} from 'react';
import {Page, Layout, Card, Stack, TextContainer, Button, AlphaCard, VerticalStack} from '@shopify/polaris';
import {useTranslation} from "react-i18next";
import shopify from "../../shopify.js";


const PricingPage = () => {
    const { t } = useTranslation();
    const [selectedPlan, setSelectedPlan] = useState('');



    const redirectToShopifyBilling = async (plan) => {
        let billingPlanId;
        setSelectedPlan(plan);
        const urlParams = new URLSearchParams(window.location.search);
        const sessionParam = urlParams.get('session');
        const session = JSON.parse(decodeURIComponent(sessionParam));

        if (selectedPlan === 'free') {
            billingPlanId = 0;
        } else if (selectedPlan === 'payed') {
            billingPlanId = '1';
        }

        try {

            const response = await shopify.api.billing.request({
                session: session,
                plan: selectedPlan,
                isTest: true,
            });

        } catch (error) {
            console.error('Fehler bei der Billing-Anfrage:', error);
        }

    };


    const featureList = ['Feature1','Feature2', 'Feature3', 'Feature4', 'Feature5'];
    return (
        <Page
            title="Pricing"
        >
            <Layout>
                <Layout.Section>
                    <AlphaCard title="Basic Plan" sectioned>
                        <VerticalStack alignment="center">
                            <VerticalStack>
                                <p>{t('billing.free')}</p>
                                <p>{t('billing.listText')}</p>
                                <ul>
                                    {featureList.map((featureKey) => (
                                        <li key={featureKey}>{t(`billing.features.${featureKey}`)}</li>
                                    ))}
                                </ul>
                            </VerticalStack>
                        </VerticalStack>
                        <Button
                            primary
                            onClick={() => redirectToShopifyBilling('free')}
                        >
                            {t('billing.submit')}
                        </Button>
                    </AlphaCard>
                </Layout.Section>
                <Layout.Section>
                    <AlphaCard title="Pro Plan" sectioned>
                        <VerticalStack alignment="center">
                            <VerticalStack>
                                <p>Upgrade to our Pro Plan for more features</p>
                                <p>Price: $20/month</p>
                                <p>Features:</p>
                                <ul>
                                    <li>Feature 1</li>
                                    <li>Feature 2</li>
                                    <li>Feature 3</li>
                                    <li>Feature 4</li>
                                </ul>
                            </VerticalStack>

                        </VerticalStack>
                        <Button primary>Add to Cart</Button>
                    </AlphaCard>
                </Layout.Section>
            </Layout>
        </Page>
    );
};

export default PricingPage;
