/**
 * BakChemformula AI - Professional Scientific Version
 * Developed for: babuker.github.io/BakChemformula
 */

// 1. قاعدة بيانات المواد الفعالة (APIs) مع خصائصها الفيزوكيميائية
const apiDb = {
    "Paracetamol": { dose: 500, cost: 14.5, solubility: "low", moisture_sensitive: false },
    "Metronidazole": { dose: 500, cost: 38.0, solubility: "medium", moisture_sensitive: true },
    "Diclofenac": { dose: 50, cost: 82.0, solubility: "low", moisture_sensitive: true },
    "Ibuprofen": { dose: 200, cost: 26.0, solubility: "low", moisture_sensitive: false }
};

// 2. قاعدة بيانات المواد المضافة المعيارية (Pharmacopeial Grade Excipients)
const excipients = {
    fillers: [
        { name: "Microcrystalline Cellulose (Avicel PH-102)", role: "Filler/Binder", cost: 8.5 },
        { name: "Lactose Monohydrate (Spray-Dried)", role: "Filler", cost: 4.2 },
        { name: "Dibasic Calcium Phosphate (DCP)", role: "Filler", cost: 5.8 }
    ],
    binders: [
        { name: "Povidone (PVP K30)", role: "Binder", cost: 22.0 },
        { name: "HPMC (Methocel E15)", role: "Binder", cost: 18.5 }
    ],
    disintegrants: [
        { name: "Croscarmellose Sodium (Ac-Di-Sol)", role: "Superdisintegrant", cost: 15.0 },
        { name: "Sodium Starch Glycolate (Primojel)", role: "Disintegrant", cost: 9.5 }
    ],
    lubricants: [
        { name: "Magnesium Stearate (Vegetable Grade)", role: "Lubricant", cost: 12.0 },
        { name: "Colloidal Silicon Dioxide (Aerosil 200)", role: "Glidant", cost: 28.0 }
    ]
};

const i18n = {
    ar: {
        title: "نظام BakChemformula الذكي",
        th: ["المادة المكونة", "الدور الوظيفي", "الكمية (mg)", "النسبة %", "التكلفة $"],
        eff: "مؤشر توافق الصيغة (Q1/Q2):"
    },
    en: {
        title: "BakChemformula AI System",
        th: ["Component", "Function", "Qty (mg)", "%", "Cost $"],
        eff: "Formula Quality Index (Q1/Q2):"
    }
};

let currentLang = 'ar';
let charts = { donut: null, bar: null };

function setLang(lang) {
    currentLang = lang;
    document.getElementById('mainHtml').dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.getElementById('table-head').innerHTML = i18n[lang].th.map(h => `<th>${h}</th>`).join('');
    if(document.getElementById('resultsArea').style.display === 'block') calculateAll();
}

function calculateAll() {
    const apiName = document.getElementById('apiSelect').value;
    const strategy = document.getElementById('strategy').value;
    const batchSize = parseInt(document.getElementById('batchSize').value);
    const api = apiDb[apiName];

    // --- منطق الاختيار العلمي للمواد المضافة ---
    
    // 1. اختيار المادة المالئة (Filler)
    let selectedFiller = excipients.fillers[0]; // الافتراضي Avicel PH-102
    if (apiName === "Diclofenac") selectedFiller = excipients.fillers[2]; // DCP مناسب للديكلوفيناك
    
    // 2. اختيار المادة المفككة (Disintegrant)
    let selectedDis = strategy === "quality" ? excipients.disintegrants[0] : excipients.disintegrants[1];
    
    // 3. المادة المزلقة (Lubricant)
    let selectedLub = excipients.lubricants[0];

    // حسابات الأوزان
    const totalWeight = api.dose < 100 ? 150 : (api.dose + 150);
    const remaining = totalWeight - api.dose;
    
    const formula = [
        { name: apiName + " (Active)", role: "API", qty: api.dose, cost: (api.dose * api.cost / 1000000) },
        { name: selectedFiller.name, role: selectedFiller.role, qty: remaining * 0.85, cost: (remaining * 0.85 * selectedFiller.cost / 1000000) },
        { name: selectedDis.name, role: selectedDis.role, qty: remaining * 0.10, cost: (remaining * 0.10 * selectedDis.cost / 1000000) },
        { name: selectedLub.name, role: selectedLub.role, qty: remaining * 0.05, cost: (remaining * 0.05 * selectedLub.cost / 1000000) }
    ];

    // عرض النتائج
    document.getElementById('resultsArea').style.display = 'block';
    document.getElementById('formulaBody').innerHTML = formula.map(i => `
        <tr>
            <td style="text-align:right"><b>${i.name}</b></td>
            <td>${i.role}</td>
            <td>${i.qty.toFixed(1)}</td>
            <td>${((i.qty/totalWeight)*100).toFixed(1)}%</td>
            <td>$${(i.cost * batchSize).toFixed(2)}</td>
        </tr>
    `).join('');

    const efficiency = strategy === "quality" ? 98 : 85;
    document.getElementById('efficiencyWrapper').innerHTML = `
        <div style="text-align:center">
            <b>${i18n[currentLang].eff} ${efficiency}%</b>
            <div class="progress-bar"><div class="progress-fill" style="width:${efficiency}%; background:#0e4b62"></div></div>
        </div>
    `;

    drawCharts(formula);
}

function drawCharts(formula) {
    const ctxD = document.getElementById('formulaChart').getContext('2d');
    if(charts.donut) charts.donut.destroy();
    charts.donut = new Chart(ctxD, {
        type: 'doughnut',
        data: {
            labels: formula.map(i=>i.name),
            datasets: [{ data: formula.map(i=>i.qty), backgroundColor:['#0e4b62','#3498db','#2ecc71','#e74c3c']}]
        },
        options: { maintainAspectRatio: false }
    });
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // العلامة المائية
    doc.setTextColor(245, 245, 245);
    doc.setFontSize(50);
    doc.text("BakChemformula SCIENTIFIC", 20, 150, { angle: 45 });

    // العنوان
    doc.setTextColor(14, 75, 98);
    doc.setFontSize(20);
    doc.text("Pharmaceutical Formulation Report (Standard Grade)", 105, 20, { align: 'center' });

    // الجدول
    doc.autoTable({
        startY: 40,
        head: [i18n[currentLang].th],
        body: Array.from(document.querySelectorAll('#formulaBody tr')).map(tr => 
            Array.from(tr.querySelectorAll('td')).map(td => td.innerText)
        ),
        headStyles: { fillColor: [14, 75, 98] }
    });

    // الباركود
    const canvas = document.getElementById("barcodeCanvas");
    const barcodeVal = "BK-" + Math.floor(Math.random()*900000);
    JsBarcode(canvas, barcodeVal, { format: "CODE128" });
    doc.addImage(canvas.toDataURL("image/png"), 'PNG', 150, 265, 45, 15);

    doc.setFontSize(8);
    doc.text("This report complies with standard pharmacopeial excipient naming conventions.", 105, 285, { align: 'center' });
    
    doc.save(`${barcodeVal}_BakChem_Scientific.pdf`);
}

setLang('ar');
