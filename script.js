// مصفوفة المواد المضافة المعيارية (Pharmacopeial Grade)
const excipientPrices = {
    // المواد المالئة (Fillers/Diluents)
    "Microcrystalline Cellulose (Avicel PH-102)": 8.50,
    "Lactose Monohydrate (Spray-Dried)": 4.20,
    "Dibasic Calcium Phosphate (DCP)": 5.80,
    
    // المواد الرابطة (Binders)
    "Povidone (PVP K30)": 22.0,
    "Hydroxypropyl Methylcellulose (HPMC E15)": 18.5,
    
    // المواد المفككة (Disintegrants)
    "Croscarmellose Sodium (Ac-Di-Sol)": 15.0,
    "Sodium Starch Glycolate (Primojel)": 9.5,
    
    // المواد المزلقة والمنزلقة (Lubricants/Glidants)
    "Magnesium Stearate (Vegetable Grade)": 12.0,
    "Colloidal Silicon Dioxide (Aerosil 200)": 28.0
};

// منطق الاختيار العلمي المحدث داخل دالة calculateAll
function calculateAll() {
    const apiName = document.getElementById('apiSelect').value;
    const api = apiDb[apiName];
    
    // اختيار المادة المالئة بناءً على طبيعة المادة الفعالة
    let filler = "Microcrystalline Cellulose (Avicel PH-102)"; // الخيار القياسي للكبس المباشر
    if (apiName === "Diclofenac") {
        filler = "Dibasic Calcium Phosphate (DCP)"; // لمنع التفاعل مع الأوساط الحمضية
    } else if (apiName === "Lactose Monohydrate (Spray-Dried)") {
        filler = "Lactose Monohydrate (Spray-Dried)"; // للسيولة العالية
    }

    // اختيار المادة الرابطة
    let binder = "Povidone (PVP K30)"; 
    if (api.moist) {
        binder = "Hydroxypropyl Methylcellulose (HPMC E15)"; // للمواد الحساسة للرطوبة
    }

    // باقي منطق الحساب...
    // تم استبدال الأسماء الافتراضية بأسماء تجارية وعلمية معيارية
}
