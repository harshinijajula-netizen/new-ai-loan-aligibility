export type Locale = "en" | "hi" | "te";

export const localeNames: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी",
  te: "తెలుగు",
};

const t: Record<string, Record<Locale, string>> = {
  // Nav
  "nav.home": { en: "Home", hi: "होम", te: "హోమ్" },
  "nav.check": { en: "Check", hi: "जांचें", te: "తనఖా" },
  "nav.howItWorks": { en: "How It Works", hi: "कैसे काम करता है", te: "ఎలా పని చేస్తుంది" },
  "nav.loanTypes": { en: "Loan Types", hi: "लोन प्रकार", te: "రుణ రకాలు" },
  "nav.tools": { en: "Tools", hi: "उपकरण", te: "సాధనాలు" },
  "nav.rules": { en: "Rules", hi: "नियम", te: "నియమాలు" },
  "nav.login": { en: "Login", hi: "लॉगिन", te: "లాగిన్" },
  "nav.register": { en: "Register", hi: "रजिस्टर", te: "నమోదు" },
  "nav.logout": { en: "Logout", hi: "लॉगआउट", te: "లాగ్ అవుట్" },
  "nav.welcome": { en: "Welcome", hi: "स्वागत है", te: "స్వాగతం" },
  "nav.dashboard": { en: "Dashboard", hi: "डैशबोर्ड", te: "డాష్‌బోర్డ్" },

  // Hero
  "hero.badge": { en: "AI-Powered Financial Analysis", hi: "AI-संचालित वित्तीय विश्लेषण", te: "AI-ఆధారిత ఆర్థిక విశ్లేషణ" },
  "hero.title1": { en: "Know Your Loan", hi: "अपने लोन की", te: "మీ రుణ" },
  "hero.titleHighlight": { en: "Eligibility", hi: "पात्रता", te: "అర్హతను" },
  "hero.title2": { en: "in Seconds", hi: "सेकंड में जानें", te: "సెకన్లలో తెలుసుకోండి" },
  "hero.subtitle": { en: "Our advanced AI analyzes your financial profile to provide instant, personalized loan eligibility assessments with actionable recommendations.", hi: "हमारा उन्नत AI आपकी वित्तीय प्रोफ़ाइल का विश्लेषण करके तुरंत व्यक्तिगत लोन पात्रता आकलन और कार्यविधि सुझाव प्रदान करता है।", te: "మా ఉన్నత AI మీ ఆర్థిక ప్రొఫైల్‌ను విశ్లేషించి, తక్షణమే వ్యక్తిగత రుణ అర్హత మూల్యాంకనం మరియు చర్యాత్మక సిఫార్సులను అందిస్తుంది." },
  "hero.cta": { en: "Check Eligibility", hi: "पात्रता जांचें", te: "అర్హత తనఖా" },
  "hero.learn": { en: "Learn About Loans", hi: "लोन के बारे में जानें", te: "రుణాల గురించి తెలుసుకోండి" },
  "hero.secure": { en: "Bank-Grade Security", hi: "बैंक ग्रेड सुरक्षा", te: "బ్యాంక్-గ్రేడ్ సురక్ష" },
  "hero.instant": { en: "Instant Results", hi: "तत्काल परिणाम", te: "తక్షణాత్మక ఫలితాలు" },
  "hero.ai": { en: "AI-Powered", hi: "AI-संचालित", te: "AI-ఆధారితం" },

  // Stats
  "stat.users": { en: "Users Analyzed", hi: "उपयोगकर्ता विश्लेषण", te: "వినియోగదారుల విశ్లేషణ" },
  "stat.approval": { en: "Approval Rate", hi: "स्वीकृति दर", te: "ఆమోద రేటు" },
  "stat.loanTypes": { en: "Loan Types", hi: "लोन प्रकार", te: "రుణ రకాలు" },
  "stat.aiAccuracy": { en: "AI Accuracy", hi: "AI सटीकता", te: "AI కచ్చితత్వం" },

  // Benefits
  "benefits.badge": { en: "Premium Features", hi: "प्रीमियम सुविधाएँ", te: "ప్రీమియం ఫీచర్లు" },
  "benefits.title": { en: "Why Choose LoanIQ?", hi: "LoanIQ क्यों चुनें?", te: "LoanIQ ఎందుకు ఎంచుకోవాలి?" },
  "benefits.subtitle": { en: "Industry-leading features designed to give you the most accurate and actionable loan eligibility insights.", hi: "उद्योग-अग्रणी सुविधाएँ जो आपको सबसे सटीक और कार्यविधि लोन पात्रता अंतर्दृष्टि देती हैं।", te: "మిమ్మల్ని అత్యంత కచ్చితమైన మరియు చర్యాత్మక రుణ అర్హత అంతర్దృష్టులను అందించే పరిశ్రమ-నాయక ఫీచర్లు." },
  "benefit.aiAccuracy.title": { en: "AI-Powered Accuracy", hi: "AI-संचालित सटीकता", te: "AI-ఆధారిత కచ్చితత్వం" },
  "benefit.aiAccuracy.desc": { en: "Advanced machine learning models trained on thousands of loan profiles for precise eligibility scoring.", hi: "सटीक पात्रता स्कोरिंग के लिए हजारों लोन प्रोफ़ाइल पर प्रशिक्षित उन्नत ML मॉडल।", te: "కచ్చితమైన అర్హత స్కోరింగ్ కోసం వేలాది రుణ ప్రొఫైల్‌లపై శిక్షణ పొందిన ఉన్నత ML మోడల్స్." },
  "benefit.instant.title": { en: "Instant Processing", hi: "तत्काल प्रसंस्करण", te: "తక్షణ ప్రాసెసింగ్" },
  "benefit.instant.desc": { en: "Get comprehensive loan analysis in seconds, not days. No paperwork, no waiting periods.", hi: "दिनों नहीं, सेकंड में व्यापक लोन विश्लेषण प्राप्त करें। कोई कागजात नहीं।", te: "రోజులు కాదు, సెకన్లలో సమగ్ర రుణ విశ్లేషణ పొందండి. కాగితపని లేదు." },
  "benefit.security.title": { en: "Bank-Grade Security", hi: "बैंक ग्रेड सुरक्षा", te: "బ్యాంక్-గ్రేడ్ సురక్ష" },
  "benefit.security.desc": { en: "AES-256 encryption and TLS 1.3 protect your sensitive financial data at every step.", hi: "AES-256 एन्क्रिप्शन और TLS 1.3 हर कदम पर आपके संवेदनशील वित्तीय डेटा की सुरक्षा करते हैं।", te: "AES-256 ఎన్క్రిప్షన్ మరియు TLS 1.3 ప్రతి దశలో మీ సున్నిపించే ఆర్థిక డేటాను రక్షిస్తాయి." },
  "benefit.multilang.title": { en: "Multi-Language Support", hi: "बहुभाषी समर्थन", te: "బహుభాషా మద్దతు" },
  "benefit.multilang.desc": { en: "Access the platform in English, Hindi, and Telugu for inclusive financial guidance.", hi: "अंग्रेजी, हिंदी और तेलुगू में प्लेटफ़ॉर्म का उपयोग करें।", te: "ఇంగ్లీష్, హిందీ మరియు తెలుగులో ప్లాట్‌ఫారమ్‌ను యాక్సెస్ చేయండి." },
  "benefit.insights.title": { en: "Actionable Insights", hi: "कार्यविधि अंतर्दृष्टि", te: "చర్యాత్మక అంతర్దృష్టులు" },
  "benefit.insights.desc": { en: "Receive personalized recommendations to improve your eligibility and secure better rates.", hi: "अपनी पात्रता सुधारने और बेहतर दरें सुरक्षित करने के लिए व्यक्तिगत सुझाव प्राप्त करें।", te: "మీ అర్హతను మెరుగుపరచడానికి మరియు మెరుగైన రేట్లను పొందడానికి వ్యక్తిగత సిఫార్సులు." },
  "benefit.free.title": { en: "Completely Free", hi: "पूरी तरह मुफ्त", te: "పూర్తిగా ఉచితం" },
  "benefit.free.desc": { en: "No hidden charges, no subscriptions. Full access to all features at zero cost.", hi: "कोई छिपे हुए शुल्क नहीं, कोई सदस्यता नहीं। सभी सुविधाओं तक मुफ्त पहुंच।", te: "దాచిన రుసుములు లేవు, సబ్‌స్క్రిప్షన్లు లేవు. అన్ని ఫీచర్లకు ఉచిత యాక్సెస్." },

  // Eligibility
  "elig.badge": { en: "Eligibility Assessment", hi: "पात्रता मूल्यांकन", te: "అర్హత మూల్యాంకనం" },
  "elig.title": { en: "Check Your Eligibility", hi: "अपनी पात्रता जांचें", te: "మీ అర్హత తనఖా చేయండి" },
  "elig.subtitle": { en: "Enter your details below and our AI will analyze your loan eligibility in real time.", hi: "नीचे अपना विवरण दर्ज करें और हमारा AI आपकी लोन पात्रता का विश्लेषण करेगा।", te: "క్రింద మీ వివరాలను నమోదు చేయండి, మా AI మీ రుణ అర్హతను విశ్లేషిస్తుంది." },
  "elig.tab.form": { en: "Form", hi: "फॉर्म", te: "ఫారమ్" },
  "elig.tab.results": { en: "Results", hi: "परिणाम", te: "ఫలితాలు" },

  // Form fields
  "form.name": { en: "Full Name", hi: "पूरा नाम", te: "పూర్తి పేరు" },
  "form.namePlaceholder": { en: "Enter your full name", hi: "अपना पूरा नाम दर्ज करें", te: "మీ పూర్తి పేరు నమోదు చేయండి" },
  "form.income": { en: "Monthly Income (₹)", hi: "मासिक आय (₹)", te: "నెలవారీ ఆదాయం (₹)" },
  "form.incomePlaceholder": { en: "e.g. 50000", hi: "जैसे 50000", te: "ఉదా. 50000" },
  "form.creditScore": { en: "Credit Score", hi: "क्रेडिट स्कोर", te: "క్రెడిట్ స్కోర్" },
  "form.creditScorePlaceholder": { en: "300 - 900", hi: "300 - 900", te: "300 - 900" },
  "form.loanAmount": { en: "Loan Amount (₹)", hi: "लोन राशि (₹)", te: "రుణ మొత్తం (₹)" },
  "form.loanAmountPlaceholder": { en: "e.g. 1000000", hi: "जैसे 1000000", te: "ఉదా. 1000000" },
  "form.loanTenure": { en: "Loan Tenure (Years)", hi: "लोन अवधि (वर्ष)", te: "రుణ వ్యవధి (సంవత్సరాలు)" },
  "form.loanTenurePlaceholder": { en: "e.g. 5", hi: "जैसे 5", te: "ఉదా. 5" },
  "form.employmentType": { en: "Employment Type", hi: "रोज़गार प्रकार", te: "ఉద్యోగ రకం" },
  "form.employmentTypePlaceholder": { en: "Select type", hi: "प्रकार चुनें", te: "రకం ఎంచుకోండి" },
  "form.existingDebt": { en: "Existing Debt (₹)", hi: "मौजूदा ऋण (₹)", te: "ఇప్పటికే ఉన్న రుణం (₹)" },
  "form.existingDebtPlaceholder": { en: "e.g. 5000 (0 if none)", hi: "जैसे 5000 (शून्य यदि नहीं)", te: "ఉదా. 5000 (లేకుంటే 0)" },
  "form.loanPurpose": { en: "Loan Purpose", hi: "लोन उद्देश्य", te: "రుణ ఉద్దేశ్యం" },
  "form.loanPurposePlaceholder": { en: "Select purpose", hi: "उद्देश्य चुनें", te: "ఉద్దేశ్యం ఎంచుకోండి" },
  "form.submit": { en: "Analyze Eligibility", hi: "पात्रता विश्लेषण करें", te: "అర్హత విశ్లేషించండి" },
  "form.analyzing": { en: "Analyzing with AI...", hi: "AI से विश्लेषण हो रहा है...", te: "AIతో విశ్లేషిస్తోంది..." },
  "form.required": { en: "This field is required", hi: "यह फ़ील्ड आवश्यक है", te: "ఈ ఫీల్డ్ అవసరం" },
  "form.invalidEmail": { en: "Please enter a valid email", hi: "कृपया सही ईमेल दर्ज करें", te: "దయచేసి చెల్లునటువంటి ఇమెయిల్ నమోదు చేయండి" },

  // Employment types
  "emp.salaried": { en: "Salaried", hi: "वेतनभोगी", te: "శాలరీడ్" },
  "emp.selfEmployed": { en: "Self-Employed", hi: "स्व-रोज़गार", te: "స్వయం-ఉపాధి" },
  "emp.business": { en: "Business Owner", hi: "व्यापारी", te: "వ్యాపార యజమాని" },
  "emp.freelancer": { en: "Freelancer", hi: "फ्रीलांसर", te: "ఫ్రీలాన్సర్" },
  "emp.retired": { en: "Retired", hi: "सेवानिवृत्त", te: "పదవీ విరమణ" },
  "emp.student": { en: "Student", hi: "छात्र", te: "విద్యార్థి" },

  // Loan purposes
  "purpose.home": { en: "Home Loan", hi: "होम लोन", te: "హోమ్ లోన్" },
  "purpose.personal": { en: "Personal Loan", hi: "व्यक्तिगत लोन", te: "పర్సనల్ లోన్" },
  "purpose.education": { en: "Education Loan", hi: "शिक्षा लोन", te: "విద్యా లోన్" },
  "purpose.vehicle": { en: "Vehicle Loan", hi: "वाहन लोन", te: "వాహన లోన్" },
  "purpose.business": { en: "Business Loan", hi: "व्यापार लोन", te: "బిజినెస్ లోన్" },
  "purpose.gold": { en: "Gold Loan", hi: "गोल्ड लोन", te: "గోల్డ్ లోన్" },
  "purpose.agriculture": { en: "Agriculture Loan", hi: "कृषि लोन", te: "వ్యవసాయ లోన్" },
  "purpose.medical": { en: "Medical Loan", hi: "चिकित्सा लोन", te: "వైద్య లోన్" },

  // Results
  "results.score": { en: "Eligibility Score", hi: "पात्रता स्कोर", te: "అర్హత స్కోర్" },
  "results.maxAmount": { en: "Max Loan Amount", hi: "अधिकतम लोन राशि", te: "గరిష్ఠ రుణ మొత్తం" },
  "results.recommendedRate": { en: "Recommended Rate", hi: "अनुशंसित दर", te: "సిఫార్సు చేసిన రేటు" },
  "results.riskLevel": { en: "Risk Level", hi: "जोखिम स्तर", te: "రిస్క్ స్తరం" },
  "results.factors": { en: "Factor Breakdown", hi: "कारक विश्लेषण", te: "కారక విభజన" },
  "results.creditScore": { en: "Credit Score", hi: "क्रेडिट स्कोर", te: "క్రెడిట్ స్కోర్" },
  "results.incomeStability": { en: "Income Stability", hi: "आय स्थिरता", te: "ఆదాయ స్థిరత" },
  "results.dti": { en: "Debt-to-Income", hi: "ऋण-से-आय", te: "రుణ-నుండి-ఆదాయం" },
  "results.lti": { en: "Loan-to-Income", hi: "लोन-से-आय", te: "రుణ-నుండి-ఆదాయం" },
  "results.employmentStability": { en: "Employment Stability", hi: "रोज़गार स्थिरता", te: "ఉద్యోగ స్థిరత" },
  "results.aiAnalysis": { en: "AI Analysis", hi: "AI विश्लेषण", te: "AI విశ్లేషణ" },
  "results.recommendations": { en: "Recommendations", hi: "सुझाव", te: "సిఫార్సులు" },
  "results.checkAnother": { en: "Check Another", hi: "दूसरा जांचें", te: "మరొకటి తనఖా" },
  "results.risk.low": { en: "Low Risk", hi: "कम जोखिम", te: "తక్కువ రిస్క్" },
  "results.risk.medium": { en: "Medium Risk", hi: "मध्यम जोखिम", te: "మధ్యస్థ రిస్క్" },
  "results.risk.high": { en: "High Risk", hi: "उच्च जोखिम", te: "అధిక రిస్క్" },
  "results.risk.veryHigh": { en: "Very High Risk", hi: "बहुत उच्च जोखिम", te: "చాలా అధిక రిస్క్" },

  // History
  "history.title": { en: "Recent Checks", hi: "हालिया जांच", te: "ఇటీవలి తనఖాలు" },
  "history.empty": { en: "No checks yet. Submit the form to see your history.", hi: "अभी तक कोई जांच नहीं। अपना इतिहास देखने के लिए फॉर्म भरें।", te: "ఇంకా తనఖాలు లేవు. మీ చరిత్రను చూడటానికి ఫారమ్ సమర్పించండి." },
  "history.view": { en: "View", hi: "देखें", te: "చూడు" },
  "history.delete": { en: "Delete", hi: "हटाएं", te: "తొలగించు" },

  // Loan types
  "loantypes.badge": { en: "Loan Categories", hi: "लोन श्रेणियाँ", te: "రుణ వర్గాలు" },
  "loantypes.title": { en: "Explore Loan Types", hi: "लोन प्रकार देखें", te: "రుణ రకాలను అన్వేషించండి" },
  "loantypes.subtitle": { en: "We support eligibility analysis for a wide range of loan categories.", hi: "हम विभिन्न लोन श्रेणियों के लिए पात्रता विश्लेषण करते हैं।", te: "మేము విస్తృత శ్రేణి రుణ వర్గాలకు అర్హత విశ్లేషణను మద్దతు ఇస్తాము." },
  "loantypes.home": { en: "Home Loan", hi: "होम लोन", te: "హోమ్ లోన్" },
  "loantypes.home.desc": { en: "Finance your dream home with competitive rates", hi: "प्रतिस्पर्धी दरों पर अपने सपनों का घर बनाएं", te: "పోటీ రేట్లతో మీ కల ఇంటికి ఫైనాన్స్" },
  "loantypes.personal": { en: "Personal Loan", hi: "व्यक्तिगत लोन", te: "పర్సనల్ లోన్" },
  "loantypes.personal.desc": { en: "Flexible personal loans for any need", hi: "किसी भी ज़रूरत के लिए लचीले व्यक्तिगत लोन", te: "ఏదైనా అవసరానికి సౌకర్యవంతమైన పర్సనల్ లోన్లు" },
  "loantypes.education": { en: "Education Loan", hi: "शिक्षा लोन", te: "విద్యా లోన్" },
  "loantypes.education.desc": { en: "Invest in education with easy repayment", hi: "आसान वापसी के साथ शिक्षा में निवेश करें", te: "సులభ చెల్లింపులతో విద్యలో పెట్టుబడి" },
  "loantypes.vehicle": { en: "Vehicle Loan", hi: "वाहन लोन", te: "వాహన లోన్" },
  "loantypes.vehicle.desc": { en: "Drive home your dream car today", hi: "आज ही अपने सपनों की कार घर लाएं", te: "ఈరోజే మీ కల కారును ఇంటికి తెచ్చుకోండి" },
  "loantypes.business": { en: "Business Loan", hi: "व्यापार लोन", te: "బిజినెస్ లోన్" },
  "loantypes.business.desc": { en: "Fuel your entrepreneurial ambitions", hi: "अपने उद्यमशीलता के सपने को पूरा करें", te: "మీ వ్యవసాయ ఆకాంక్షలను నింపండి" },
  "loantypes.gold": { en: "Gold Loan", hi: "गोल्ड लोन", te: "గోల్డ్ లోన్" },
  "loantypes.gold.desc": { en: "Unlock value from your gold assets", hi: "अपने सोने से मूल्य अनलॉक करें", te: "మీ బంగారు ఆస్తుల నుండి విలువను అన్‌లాక్ చేయండి" },
  "loantypes.agriculture": { en: "Agriculture Loan", hi: "कृषि लोन", te: "వ్యవసాయ లోన్" },
  "loantypes.agriculture.desc": { en: "Support for farmers and agri-business", hi: "किसानों और कृषि व्यवसाय के लिए समर्थन", te: "రైతులు మరియు వ్యవసాయ వ్యాపారానికి మద్దతు" },
  "loantypes.medical": { en: "Medical Loan", hi: "चिकित्सा लोन", te: "వైద్య లోన్" },
  "loantypes.medical.desc": { en: "Cover healthcare expenses with ease", hi: "स्वास्थ्य सेवा खर्चों को आसानी से कवर करें", te: "ఆరోగ్య సంరక్షణ ఖర్చులను సులభంగా కవర్ చేయండి" },

  // Finance Tools
  "tools.badge": { en: "Financial Tools", hi: "वित्तीय उपकरण", te: "ఆర్థిక సాధనాలు" },
  "tools.title": { en: "Finance Tools", hi: "वित्त उपकरण", te: "ఫైనాన్స్ టూల్స్" },
  "tools.subtitle": { en: "Powerful calculators and comparison tools to make informed financial decisions.", hi: "सूचित वित्तीय निर्णय लेने के लिए शक्तिशाली कैलकुलेटर और तुलना उपकरण।", te: "సమర్థవంతమైన ఆర్థిక నిర్ణయాల తీసుకోవడానికి క్యాలిక్యులేటర్లు మరియు సాధనాలు." },
  "tools.emi.title": { en: "EMI Calculator", hi: "EMI कैलकुलेटर", te: "EMI క్యాలిక్యులేటర్" },
  "tools.emi.subtitle": { en: "Calculate your monthly loan EMI instantly", hi: "अपना मासिक EMI तुरंत गणना करें", te: "మీ నెలవారీ EMI ను తక్షణమే లెక్కించండి" },
  "tools.emi.principal": { en: "Loan Amount (₹)", hi: "लोन राशि (₹)", te: "రుణ మొత్తం (₹)" },
  "tools.emi.rate": { en: "Interest Rate (%)", hi: "ब्याज दर (%)", te: "వడ్పు రేటు (%)" },
  "tools.emi.tenure": { en: "Tenure (Years)", hi: "अवधि (वर्ष)", te: "వ్యవధి (సంవత్సరాలు)" },
  "tools.emi.monthlyEmi": { en: "Monthly EMI", hi: "मासिक EMI", te: "నెలవారీ EMI" },
  "tools.emi.totalInterest": { en: "Total Interest", hi: "कुल ब्याज", te: "మొత్తం వడ్పు" },
  "tools.emi.totalPayment": { en: "Total Payment", hi: "कुल भुगतान", te: "మొత్తం చెల్లింపు" },
  "tools.comparison.title": { en: "Loan Comparison", hi: "लोन तुलना", te: "రుణ పోలిక" },
  "tools.comparison.subtitle": { en: "Compare two loan options side by side", hi: "दो लोन विकल्पों की तुलना करें", te: "రెండు రుణ ఎంపికలను పక్కపక్క పోల్చండి" },
  "tools.comparison.feature": { en: "Feature", hi: "विशेषता", te: "ఫీచర్" },

  // How it works
  "how.badge": { en: "Simple Process", hi: "सरल प्रक्रिया", te: "సరళ ప్రక్రియ" },
  "how.title": { en: "How It Works", hi: "कैसे काम करता है", te: "ఎలా పని చేస్తుంది" },
  "how.subtitle": { en: "Three simple steps to get your personalized loan eligibility report.", hi: "अपनी व्यक्तिगत लोन पात्रता रिपोर्ट प्राप्त करने के तीन सरल चरण।", te: "మీ వ్యక్తిగత రుణ అర్హత నివేదికను పొందడానికి మూడు సరళ దశలు." },
  "how.step1.title": { en: "Enter Your Details", hi: "अपना विवरण दर्ज करें", te: "మీ వివరాలను నమోదు చేయండి" },
  "how.step1.desc": { en: "Provide your income, credit score, employment info, and desired loan amount through our secure form.", hi: "अपनी आय, क्रेडिट स्कोर, रोज़गार जानकारी और इच्छित लोन राशि हमारे सुरक्षित फॉर्म द्वारा दें।", te: "మీ ఆదాయం, క్రెడిట్ స్కోర్, ఉద్యోగ సమాచారం మరియు కోరుకున్న రుణ మొత్తాన్ని మా సురక్షిత ఫారమ్ ద్వారా అందించండి." },
  "how.step2.title": { en: "AI Analysis", hi: "AI विश्लेषण", te: "AI విశ్లేషణ" },
  "how.step2.desc": { en: "Our AI engine evaluates multiple financial factors including debt ratios, income stability, and creditworthiness.", hi: "हमारा AI इंजन ऋण अनुपात, आय स्थिरता और क्रेडिटवर्थ का मूल्यांकन करता है।", te: "మా AI ఇంజిన్ రుణ నిష్పత్తులు, ఆదాయ స్థిరత మరియు క్రెడిట్‌వర్త్‌నెస్‌తో సహా బహుళ ఆర్థిక కారకాలను మూల్యాంకనం చేస్తుంది." },
  "how.step3.title": { en: "Get Your Report", hi: "अपनी रिपोर्ट प्राप्त करें", te: "మీ నివేదికను పొందండి" },
  "how.step3.desc": { en: "Receive a detailed eligibility score, risk assessment, maximum loan amount, interest rate, and personalized tips.", hi: "विस्तृत पात्रता स्कोर, जोखिम मूल्यांकन, अधिकतम लोन राशि और व्यक्तिगत सुझाव प्राप्त करें।", te: "వివరణాత్మక అర్హత స్కోర్, రిస్క్ మూల్యాంకనం, గరిష్ఠ రుణ మొత్తం, వడ్పు రేటు మరియు వ్యక్తిగత చిట్కాలను పొందండి." },

  // Testimonials
  "testimonials.badge": { en: "User Feedback", hi: "उपयोगकर्ता प्रतिक्रिया", te: "వినియోగదారు ఫీడ్‌బ్యాక్" },
  "testimonials.title": { en: "What Our Users Say", hi: "हमारे उपयोगकर्ता क्या कहते हैं", te: "మా వినియోగదారులు ఏమి చెబుతారు" },
  "testimonials.subtitle": { en: "Trusted by thousands of users across India for loan eligibility insights.", hi: "भारत भर में हजारों उपयोगकर्ताओं द्वारा लोन पात्रता के लिए विश्वसनीय।", te: "భారతదేశం అంతటా వేలాది వినియోగదారులు రుణ అర్హత కోసం విశ్వసిస్తారు." },

  // FAQ
  "faq.badge": { en: "FAQs", hi: "सवाल-जवाब", te: "ప్రశ్నలు" },
  "faq.title": { en: "Frequently Asked Questions", hi: "अक्सर पूछे जाने वाले सवाल", te: "తరచుగా అడిగే ప్రశ్నలు" },

  // Rules
  "rules.badge": { en: "Legal & Compliance", hi: "कानूनी & अनुपालन", te: "చట్టపరమైన & అనుసరణ" },
  "rules.title": { en: "Rules & Regulations", hi: "नियम & विनियम", te: "నియమాలు & నిబంధనలు" },
  "rules.subtitle": { en: "Please review our policies carefully before using LoanIQ. By using this platform, you agree to the following terms and conditions.", hi: "LoanIQ का उपयोग करने से पहले कृपया हमारी नीतियों की समीक्षा करें।", te: "LoanIQ ఉపయోగించడానికి ముందు దయచేసి మా విధానాలను సమీక్షించండి." },
  "rules.terms": { en: "Terms of Service", hi: "सेवा की शर्तें", te: "సేవా నిబంధనలు" },
  "rules.privacy": { en: "Privacy & Data Protection", hi: "गोपनीयता & डेटा सुरक्षा", te: "గోప్యత & డేటా రక్షణ" },
  "rules.disclaimer": { en: "Disclaimer & Limitations", hi: "अस्वीकरण & सीमाएँ", te: "నిరాకరణ & పరిమితులు" },
  "rules.aiMethod": { en: "AI Analysis Methodology", hi: "AI विश्लेषण पद्धति", te: "AI విశ్లేషణ పద్ధతి" },
  "rules.userResp": { en: "User Responsibilities", hi: "उपयोगकर्ता जिम्मेदारियाँ", te: "వినియోగదారు బాధ్యతలు" },
  "rules.thirdParty": { en: "Third-Party Disclosures", hi: "तृतीय-पक्ष प्रकटीकरण", te: "మూడవ పక్ష వెల్లడింపులు" },
  "rules.side.compliance": { en: "Compliance Standards", hi: "अनुपालन मानक", te: "అనుసరణ ప్రమాణాలు" },
  "rules.side.rights": { en: "Your Rights", hi: "आपके अधिकार", te: "మీ హక్కులు" },
  "rules.side.dataHandling": { en: "Data Handling", hi: "डेटा हैंडलिंग", te: "డేటా నిర్వహణ" },

  // Auth
  "auth.loginTitle": { en: "Login to LoanIQ", hi: "LoanIQ में लॉगिन", te: "LoanIQ లో లాగిన్" },
  "auth.loginSubtitle": { en: "Welcome back! Please enter your credentials.", hi: "वापस स्वागत है! कृपया अपनी प्रमाण पत्र दर्ज करें।", te: "తిరిగి స్వాగతం! దయచేసి మీ ఆధారాలను నమోదు చేయండి." },
  "auth.email": { en: "Email", hi: "ईमेल", te: "ఇమెయిల్" },
  "auth.emailPlaceholder": { en: "Enter your email", hi: "अपना ईमेल दर्ज करें", te: "మీ ఇమెయిల్ నమోదు చేయండి" },
  "auth.password": { en: "Password", hi: "पासवर्ड", te: "పాస్‌వర్డ్" },
  "auth.passwordPlaceholder": { en: "Enter your password", hi: "अपना पासवर्ड दर्ज करें", te: "మీ పాస్‌వర్డ్ నమోదు చేయండి" },
  "auth.loginBtn": { en: "Login", hi: "लॉगिन", te: "లాగిన్" },
  "auth.loginLoading": { en: "Logging in...", hi: "लॉगिन हो रहा है...", te: "లాగిన్ అవుతోంది..." },
  "auth.noAccount": { en: "Don\u2019t have an account?", hi: "खाता नहीं है?", te: "ఖాతా లేదా?" },
  "auth.registerLink": { en: "Register", hi: "रजिस्टर", te: "నమోదు చేయండి" },
  "auth.registerTitle": { en: "Create Account", hi: "खाता बनाएं", te: "ఖాతా సృష్టించండి" },
  "auth.registerSubtitle": { en: "Join LoanIQ and start checking your loan eligibility.", hi: "LoanIQ से जुड़ें और अपनी लोन पात्रता जांचना शुरू करें।", te: "LoanIQలో చేరి మీ రుణ అర్హతను తనఖా చేయడం ప్రారంభించండి." },
  "auth.name": { en: "Full Name", hi: "पूरा नाम", te: "పూర్తి పేరు" },
  "auth.namePlaceholder": { en: "Enter your full name", hi: "अपना पूरा नाम दर्ज करें", te: "మీ పూర్తి పేరు నమోదు చేయండి" },
  "auth.confirmPassword": { en: "Confirm Password", hi: "पासवर्ड की पुष्टि करें", te: "పాస్‌వర్డ్ నిర్ధారించండి" },
  "auth.confirmPasswordPlaceholder": { en: "Re-enter your password", hi: "पासवर्ड दोबारा दर्ज करें", te: "మీ పాస్‌వర్డ్ మళ్ళీ నమోదు చేయండి" },
  "auth.registerBtn": { en: "Create Account", hi: "खाता बनाएं", te: "ఖాతా సృష్టించండి" },
  "auth.registerLoading": { en: "Creating account...", hi: "खाता बन रहा है...", te: "ఖాతా సృష్టమవుతోంది..." },
  "auth.hasAccount": { en: "Already have an account?", hi: "पहले से खाता है?", te: "ఇప్పటికే ఖాతా ఉందా?" },
  "auth.loginLink": { en: "Login", hi: "लॉगिन", te: "లాగిన్" },
  "auth.close": { en: "Close", hi: "बंद करें", te: "మూసివేయి" },

  // Chat
  "chat.title": { en: "AI Loan Assistant", hi: "AI लोन सहायक", te: "AI రుణ సహాయకుడు" },
  "chat.placeholder": { en: "Ask me anything about loans...", hi: "लोन के बारे में कुछ भी पूछें...", te: "రుణాల గురించి ఏదైని అడగండి..." },
  "chat.welcome": { en: "Hello! I\u2019m your AI Loan Assistant. Ask me about loans, eligibility, EMI, documents, or anything banking-related.", hi: "नमस्कार! मैं आपका AI लोन सहायक हूँ। लोन, पात्रता, EMI, दस्तावेज़ के बारे में पूछें।", te: "నమస్కారం! నేను AI రుణ సహాయకుడిని. రుణాలు, అర్హత, EMI, పత్రాల గురించి అడగండి." },
  "chat.error": { en: "Sorry, something went wrong. Please try again.", hi: "क्षमा करें, कुछ गलत हो गया। कृपया पुनः प्रयास करें।", te: "క్షమించండి, ఏదో తప్పు జరిగింది. దయచేసి మళ్ళీ ప్రయత్నించండి." },

  // Footer
  "footer.disclaimer": { en: "AI-powered loan eligibility analysis. Results are for informational purposes only and do not constitute financial advice or guarantee loan approval.", hi: "AI-संचालित लोन पात्रता विश्लेषण। परिणाम केवल जानकारी के लिए हैं और वित्तीय सलाह नहीं हैं।", te: "AI-ఆధారిత రుణ అర్హత విశ్లేషణ. ఫలితాలు సమాచార ప్రయోజనాల కోసం మాత్రమే." },
  "footer.rights": { en: "All rights reserved.", hi: "सर्वाधिकार सुरक्षित।", te: "అన్ని హక్కులు రిజర్వ్ చేయబడ్డాయి." },

  // Dashboard (after login)
  "dash.greeting": { en: "Welcome back", hi: "वापस स्वागत है", te: "తిరిగి స్వాగతం" },
  "dash.startCheck": { en: "Start a new eligibility check", hi: "नई पात्रता जांच शुरू करें", te: "కొత్త అర్హత తనఖా ప్రారంభించండి" },
};

export function getTranslation(key: string, locale: Locale, fallback?: string): string {
  return t[key]?.[locale] || t[key]?.en || fallback || key;
}
