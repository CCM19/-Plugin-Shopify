import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  AlphaCard, Box,
  Button,
  Layout,
  Page,
  Select,
  VerticalStack,
} from '@shopify/polaris';

import {useAuthenticatedFetch} from '../hooks/index.js';
import styles from '../css/styles.module.css';

const FeatureList = ({featureKey, maxFeatures, t}) => {
  const loadedFeatures = Object.keys(t(featureKey)).filter(
        (feature) => Boolean(t(`${featureKey}.${feature}`)),
    );
  const features = loadedFeatures.slice(0, maxFeatures);

  return (
    <ul>
      {features.map((feature, index) => (
        <li key={index}>{t(`${featureKey}${feature}`)}</li>
            ))}
    </ul>
  );
};

const BillingOptions = ({onOptionChange, selectedOption, t}) => {
  const handleSelectChange = (value) => {
    onOptionChange(value);
  };

  const options = [
        {label: t('billing.options.monthly'), value: 'Monthly'},
        {label: t('billing.options.yearly'), value: 'Yearly'},
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

const BusinessSection = ({onTierChange, selectedTier, t}) => {
  const handleTierChange = (value) => {
    onTierChange(value);
  };

  const tiers = [
        {label: t('billing.business.tierOne'), value: 'TierOne'},
        {label: t('billing.business.tierTwo'), value: 'TierTwo'},
        {label: t('billing.business.tierThree'), value: 'TierThree'},
        {label: t('billing.business.tierFour'), value: 'TierFour'},
        {label: t('billing.business.tierFive'), value: 'TierFive'},
  ];

  return (
    <div>
      <Select
        value={selectedTier}
        onChange={handleTierChange}
        label={t('billing.business.selectTier')}
        options={tiers}
      />
    </div>
  );
};

const Billing = () => {
  const fetch = useAuthenticatedFetch();
  const {t} = useTranslation();

  const [billingOption, setBillingOption] = useState('Monthly');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedTier, setSelectedTier] = useState('TierOne');

  const pricingData = {
    starter: {
      Monthly: '7.90',
      Yearly: '6.90',
    },
    business: {
      Monthly: {
        TierOne: '19.90',
        TierTwo: '39.90',
        TierThree: '89.90',
        TierFour: '179.90',
        TierFive: '299.90',
      },
      Yearly: {
        TierOne: '16.90',
        TierTwo: '34.90',
        TierThree: '79.90',
        TierFour: '149.90',
        TierFive: '259.90',
      },
    },
  };

  const handleOptionChange = (option) => {
    setBillingOption(option);
  };

  const handleTierChange = (tier) => {
    setSelectedTier(tier);
  };

  const handleButtonClick = async (billingSection) => {
    setSelectedPlan(billingOption);
    let billingPlan =  billingSection + billingOption;
    if (billingSection === "business") {
      billingPlan =
          billingSection + billingOption + selectedTier;
    }
    console.log(billingPlan);
    try {
      const response = await fetch('/api/billing/set-plan', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({billingPlan}),
      });
      if (await response) {
        const redirect = await response.json();
        window.top.location.replace(redirect.redirectUrl);
      }
    } catch (error) {
      console.error('Fehler beim Festlegen des Abrechnungsplans', error);
    }
  };

  return (
    <Page title={t('billing.options.title')} >
      <Layout>
        <div className={styles.gridContainer}>
          <div className={styles.layoutSection}>
            <Layout.Section >
              <Box className={styles.alphaCard}>
                <VerticalStack alignment="center">
                  <VerticalStack alignment="center" gap="4">
                    <h1 className={styles.title}>{t('billing.starter.title')}</h1>
                    <VerticalStack gap="4">
                      <VerticalStack>
                        <h1 className={styles.pricingDataStyle}>
                          {pricingData.starter[billingOption]} €
                        </h1>
                        <h1 className={styles.pricingLabel}> {billingOption === 'Monthly'
                                        ? t('billing.options.priceLabel')
                                        : t('billing.options.priceLabel')}
                        </h1>
                      </VerticalStack>
                      <VerticalStack gap="2">
                        <BillingOptions
                          onOptionChange={handleOptionChange}
                          selectedOption={billingOption}
                          t={t}
                        />

                        <Button
                          primary onClick={() => {
                            handleButtonClick("starter");
                          }}
                        >
                          {t('billing.starter.submit')}
                        </Button>

                      </VerticalStack>
                      <VerticalStack>
                        <p>{t('billing.starter.listText')}</p>
                        <FeatureList
                          featureKey="billing.starter.features.feature"
                          maxFeatures={12}
                          t={t}
                        />
                      </VerticalStack>
                    </VerticalStack>

                  </VerticalStack>

                </VerticalStack>

              </Box>
            </Layout.Section>
          </div>
          <div className={styles.layoutSection}>
            <Layout.Section>
              <Box className={styles.alphaCard}>
                <VerticalStack alignment="center" gap="4">
                  <h1 className={styles.title}>{t('billing.business.title')}</h1>
                  <VerticalStack gap="4">
                    <VerticalStack>

                      <h1 className={styles.pricingDataStyle}>
                        {pricingData.business[billingOption][selectedTier]} €
                      </h1>
                      <h1 className={styles.pricingLabel}> {billingOption === 'Monthly'
                                        ? t('billing.options.priceLabel')
                                        : t('billing.options.priceLabel')}
                      </h1>
                    </VerticalStack>
                    <VerticalStack gap="2" alignment="center">
                      <BillingOptions
                        onOptionChange={handleOptionChange}
                        selectedOption={billingOption}
                        t={t}
                      />
                      <BusinessSection
                        onTierChange={handleTierChange}
                        selectedTier={selectedTier}
                        t={t}
                      />
                      <Button
                        fullWidth="false" textAlign="center" primary onClick={() => {
                          handleButtonClick("business");
                        }}
                      >
                        {t('billing.business.submit')}
                      </Button>
                    </VerticalStack>
                    <VerticalStack>
                      <p>{t('billing.business.listText')}</p>
                      <FeatureList
                        featureKey="billing.business.features.feature"
                        maxFeatures={16}
                        t={t}
                      />
                    </VerticalStack>
                  </VerticalStack>
                </VerticalStack>
              </Box>
            </Layout.Section>
          </div>
        </div>

        <Layout.Section>
          <AlphaCard title={t('billing.standardFeatures.title')} sectioned>
            <h1 className={styles.title}>{t('billing.standardFeatures.title')}</h1>
            <FeatureList
              featureKey="billing.standardFeatures.features.feature"
              maxFeatures={42}
              t={t}
            />
          </AlphaCard>
        </Layout.Section>

      </Layout>
    </Page>
  );
};

export default Billing;
