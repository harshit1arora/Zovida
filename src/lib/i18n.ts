
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translations
const resources = {
  en: {
    translation: {
      "app.title": "Zovida",
      "app.subtitle": "Medical Assistant",
      "nav.home": "Home",
      "nav.scan": "Scan",
      "nav.doctors": "Doctors",
      "nav.signin": "Sign In",
      "hero.title": "Check Your Medicine Safety in",
      "hero.highlight": "Seconds",
      "hero.desc": "Scan your prescription and instantly detect dangerous drug interactions. Powered by Azure AI, verified by doctors.",
      "hero.protecting": "Protecting lives with AI",
      "scan.button": "Scan Prescription",
      "scan.consent.title": "Data Privacy & Consent",
      "scan.consent.desc": "Before we proceed, please review how we handle your data.",
      "scan.consent.point1": "Your data is processed locally on your device whenever possible.",
      "scan.consent.point2": "We do not store your prescription images without your explicit permission.",
      "scan.consent.point3": "Anonymized data may be used to improve our AI models.",
      "scan.agree": "I Agree & Continue",
      "results.export.pdf": "Export PDF",
      "results.share.whatsapp": "Share on WhatsApp",
      "network.online": "You are Online",
      "network.offline": "You are Offline",
      "network.syncing": "Syncing...",
      "session.summary": "Session Summary"
    }
  },
  es: {
    translation: {
      "app.title": "Zovida",
      "app.subtitle": "Asistente Médico",
      "nav.home": "Inicio",
      "nav.scan": "Escanear",
      "nav.doctors": "Doctores",
      "nav.signin": "Iniciar Sesión",
      "hero.title": "Verifique la seguridad de su medicina en",
      "hero.highlight": "Segundos",
      "hero.desc": "Escanee su receta y detecte instantáneamente interacciones peligrosas entre medicamentos. Impulsado por Azure AI, verificado por médicos.",
      "hero.protecting": "Protegiendo vidas con IA",
      "scan.button": "Escanear Receta",
      "scan.consent.title": "Privacidad de Datos y Consentimiento",
      "scan.consent.desc": "Antes de continuar, revise cómo manejamos sus datos.",
      "scan.consent.point1": "Sus datos se procesan localmente en su dispositivo siempre que es posible.",
      "scan.consent.point2": "No almacenamos las imágenes de sus recetas sin su permiso explícito.",
      "scan.consent.point3": "Los datos anónimos pueden usarse para mejorar nuestros modelos de IA.",
      "scan.agree": "Acepto y Continuar",
      "results.export.pdf": "Exportar PDF",
      "results.share.whatsapp": "Compartir en WhatsApp",
      "network.online": "Estás en línea",
      "network.offline": "Estás desconectado",
      "network.syncing": "Sincronizando...",
      "session.summary": "Resumen de la Sesión"
    }
  },
  hi: {
    translation: {
      "app.title": "Zovida",
      "app.subtitle": "चिकित्सा सहायक",
      "nav.home": "होम",
      "nav.scan": "स्कैन करें",
      "nav.doctors": "डॉक्टर",
      "nav.signin": "साइन इन करें",
      "hero.title": "अपनी दवा की सुरक्षा जांचें",
      "hero.highlight": "कुछ सेकंड में",
      "hero.desc": "अपनी पर्ची को स्कैन करें और तुरंत खतरनाक दवा इंटरैक्शन का पता लगाएं। Azure AI द्वारा संचालित, डॉक्टरों द्वारा सत्यापित।",
      "hero.protecting": "AI के साथ जीवन की रक्षा",
      "scan.button": "पर्ची स्कैन करें",
      "scan.consent.title": "डेटा गोपनीयता और सहमति",
      "scan.consent.desc": "आगे बढ़ने से पहले, कृपया देखें कि हम आपके डेटा को कैसे संभालते हैं।",
      "scan.consent.point1": "जहां संभव हो, आपका डेटा आपके डिवाइस पर स्थानीय रूप से संसाधित किया जाता है।",
      "scan.consent.point2": "हम आपकी स्पष्ट अनुमति के बिना आपकी पर्ची की छवियों को संग्रहीत नहीं करते हैं।",
      "scan.consent.point3": "हमारे AI मॉडल को बेहतर बनाने के लिए गुमनाम डेटा का उपयोग किया जा सकता है।",
      "scan.agree": "मैं सहमत हूं और जारी रखें",
      "results.export.pdf": "PDF निर्यात करें",
      "results.share.whatsapp": "WhatsApp पर साझा करें",
      "network.online": "आप ऑनलाइन हैं",
      "network.offline": "आप ऑफ़लाइन हैं",
      "network.syncing": "सिंक हो रहा है...",
      "session.summary": "सत्र सारांश"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
