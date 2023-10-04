import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {AlphaCard, Button, ButtonGroup, Layout, Page, Select, VerticalStack} from "@shopify/polaris";
import {useAuthenticatedFetch} from "../hooks/index.js";
import i18n from "i18next";

/**
 * Dynamic list generator
 * @param featureKey
 * @param maxFeatures
 * @returns {JSX.Element}
 * @constructor
 */
const FeatureList = ({featureKey, maxFeatures}) =>{
    const { t } = useTranslation();
    const [features, setFeatures] = useState([]);

    useEffect(() => {
        const loadedFeatures = Object.keys(t(featureKey))
            .filter((feature) => !!t(`${featureKey}.${feature}`));
        setFeatures(loadedFeatures);
    }, [featureKey, t]);
    return (
        <ul>
            {features.slice(0, maxFeatures).map((feature, index) => (
                <li key={index}>{t(`${featureKey}${feature}`)}</li>
            ))}
        </ul>
    );
};
const BillingOptions = ({ onOptionChange }) => {
    const { t } = useTranslation();
    const [selectedOption, setSelectedOption] = useState('monthly');

    const handleSelectChange = (value) => {
        setSelectedOption(value);
        onOptionChange(value); // Call the callback with the selected value
    };

    const options = [
        { label: t('billing.options.monthly'), value: 'monthly' },
        { label: t('billing.options.yearly'), value: 'yearly' }
    ];

    return (
        <div>
            <Select
                value={selectedOption}
                onChange={handleSelectChange}
                label={t('billing.options.label')}
                options={options}
            />
        </div>
    );
};





/**
 * Main Component
 * @returns {JSX.Element}
 * @constructor
 */
const Billing = () => {
    const fetch = useAuthenticatedFetch();

    const { t } = useTranslation();
    const [selectedPlan, setSelectedPlan] = useState('');
    const [billingOption, setBillingOption] = useState('monthly');
    const [selectedSection, setSelectedSection] = useState('starter');
    const handleSectionChange = (section) => {
        setSelectedSection(section);
    };
    const pricingData = {
        starter:{
            monthly: "7.90",
            yearly: "6.90"
        },
        business:{
            monthly:{
                tierOne: 19.90,
                tierTwo: 39.90,
                tierThree: 89.90,
                tierFour: 179.90,
                tierFive: 299.90
            },
            yearly: {
                tierOne: 16.90,
                tierTwo: 34.90,
                tierThree: 79.90,
                tierFour: 149.90,
                tierFive: 259.90
            }
        }
    }
    const handleOptionChange = (option) => {
        setBillingOption(option);
    };

    const redirectToShopifyBilling = async (plan) => {
        setSelectedPlan(plan);
        const setScript = async () => {
            try {
                return await fetch('/api/billing/set-plan', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({selectedPlan}),
                });
            } catch (error) {
                throw new Error("failed billing plan selection")
            }
        }
        await setScript();
    }

    return (
        <Page
            title="Billing"
        >
            <Layout>
                <Layout.Section>
                    <AlphaCard title={t('billing.starter.title')} sectioned>
                        <VerticalStack alignment="center">
                            <VerticalStack>
                                <p>{t('billing.starter.title')}</p>
                                <p>{t('billing.starter.listText')}</p>
                                <FeatureList featureKey="billing.starter.features.feature" maxFeatures={12}/>
                            </VerticalStack>
                        </VerticalStack>
                        <VerticalStack gap = "2">
                            <BillingOptions onOptionChange={handleOptionChange}/>
                                <ButtonGroup>
                                     <Button
                                         primary
                                        onClick={() => redirectToShopifyBilling(billingOption)}
                                     >{t('billing.starter.submit')}
                                    </Button>
                            </ButtonGroup>
                            <p>{t('billing.options.price')}: {pricingData[selectedSection][billingOption]} €/{billingOption === 'monthly' ? t('billing.options.monthly') : t('billing.options.monthly')}</p>
                        </VerticalStack>
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

                <Layout.Section>
                    <AlphaCard title={t('billing.standardFeatures.title')} sectioned>
                        <VerticalStack alignment="center">
                            <VerticalStack>
                                <FeatureList featureKey="billing.standardFeatures.features.feature" maxFeatures={42}/>
                            </VerticalStack>
                        </VerticalStack>
                    </AlphaCard>
                </Layout.Section>
            </Layout>
        </Page>
    );
};

export default Billing;
