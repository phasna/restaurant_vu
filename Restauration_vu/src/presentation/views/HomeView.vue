<template>
  <AppPageLayout
    :links="mainNavLinks"
    :active-path="route.path"
    :cta-label="CTA_RESERVE_LABEL"
    @logo-click="goHome"
    @navigate="push"
    @cta-click="goReservation"
  >
    <AccueilHero
      title="L'art de l'essentiel."
      lead="Une table où la simplicité rencontre l'excellence : des produits d'exception, une cuisine sincère et un accueil attentionné."
      primary-cta-label="Découvrir"
      secondary-cta-label="Nos destinations"
      :image-src="accueilHeroImage"
      image-aria-label="Salle de restaurant élégante, tables dressées."
      @primary-click="push('/etablissements')"
      @secondary-click="push('/etablissements')"
    />

    <AccueilSplitSection
      eyebrow="Philosophie"
      title="La pureté du geste culinaire."
      body="Chaque assiette raconte une intention : sublimer le produit, respecter les saisons et offrir une expérience calme, précise, mémorable."
      :reverse="false"
      heading-id="accueil-purete-heading"
      :image-src="accueilSplitPureteImage"
      image-aria-label="Dressage d'assiettes gastronomiques."
    />

    <AccueilSplitSection
      eyebrow="Maison"
      title="Une signature commune, des lieux uniques."
      body="Nos maisons partagent la même exigence — le détail, le service, le silence du geste — tout en laissant la personnalité de chaque adresse s'exprimer."
      :reverse="true"
      heading-id="accueil-maison-heading"
      :image-src="accueilSplitMaisonImage"
      image-aria-label="Ambiance chaleureuse d'une salle à manger."
    />

    <AccueilDestinationsSection
      section-title="Nos Destinations"
      section-lead="Trois adresses pour trois atmosphères : le cœur de Paris, la lumière de Lyon, l'élégance de Bordeaux."
      section-heading-id="accueil-destinations"
      :destinations="destinations"
      @discover="onDiscoverDestination"
    />

    <AccueilSensGallery
      title="L'éveil des sens"
      lead="Textures, contrastes et parfums : une galerie d'inspirations autour de nos tables."
      :images="sensGalleryImages"
    />

    <AccueilNewsletterCta
      title="Rejoignez l'expérience"
      description="Recevez les ouvertures de créneaux, les menus saisonniers et les nouvelles des maisons L'ESSENCE."
      button-label="S'abonner"
      input-placeholder="Votre adresse e-mail"
      v-model="newsletterEmail"
      @subscribe="onNewsletterSubscribe"
    />
  </AppPageLayout>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppPageLayout from "@/presentation/components/layout/AppPageLayout.vue";
import AccueilHero from "@/presentation/components/accueil/AccueilHero.vue";
import AccueilSplitSection from "@/presentation/components/accueil/AccueilSplitSection.vue";
import AccueilDestinationsSection from "@/presentation/components/accueil/AccueilDestinationsSection.vue";
import AccueilSensGallery from "@/presentation/components/accueil/AccueilSensGallery.vue";
import AccueilNewsletterCta from "@/presentation/components/accueil/AccueilNewsletterCta.vue";
import { mainNavLinks, CTA_RESERVE_LABEL } from "@/constants/navigation.js";
import {
  accueilHeroImage,
  accueilSplitPureteImage,
  accueilSplitMaisonImage,
  destinationImages,
  sensGalleryImages,
} from "@/constants/accueilImages.js";
import { useFlashMessagesStore } from "@/stores/flashMessages.js";

const route = useRoute();
const router = useRouter();
const flash = useFlashMessagesStore();

const newsletterEmail = ref("");

const destinations = [
  {
    id: "paris",
    title: "L'ESSENCE — Paris",
    subtitle: "Rive droite",
    imageSrc: destinationImages.paris,
    imageAriaLabel: "Salle du restaurant L'ESSENCE à Paris.",
  },
  {
    id: "lyon",
    title: "L'ESSENCE — Lyon",
    subtitle: "Presqu'île",
    imageSrc: destinationImages.lyon,
    imageAriaLabel: "Plat signature servi à Lyon.",
  },
  {
    id: "bordeaux",
    title: "L'ESSENCE — Bordeaux",
    subtitle: "Chartrons",
    imageSrc: destinationImages.bordeaux,
    imageAriaLabel: "Table gourmande à Bordeaux.",
  },
];

function push(to) {
  router.push(to);
}

function goHome() {
  router.push("/");
}

function goReservation() {
  router.push("/reservation/creneau");
}

function onDiscoverDestination(id) {
  push("/etablissements");
  flash.setSuccess(`Navigation vers « ${id} » : à relier à la fiche établissement.`);
}

function onNewsletterSubscribe(email) {
  flash.setSuccess(`Merci ! Inscription enregistrée pour : ${email} (mock — brancher l’API).`);
  newsletterEmail.value = "";
}
</script>
