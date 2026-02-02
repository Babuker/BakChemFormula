const apiDb = {
    "Paracetamol": { dose: 500, cost: 14.50 },
    "Metronidazole": { dose: 500, cost: 38.00 },
    "Diclofenac": { dose: 50, cost: 82.00 },
    "Ibuprofen": { dose: 200, cost: 26.00 }
};

const i18n = {
    ar: {
        title: "نظام BakChemformula الذكي", th: ["المادة", "الوظيفة", "الكمية (mg)", "%", "التكلفة $"],
        eff: "كفاءة صيغة BakChem:"
    },
    en: {
        title: "BakChemformula AI System", th: ["Material", "Role", "Qty (mg)", "%", "Cost $"],
        eff: "BakChem Efficiency Index:"
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
    const api = apiDb[apiName];
    const unitW = api.dose < 100 ? 150 : 600;
    
    const ings = [
        { name: apiName, role: 'API', qty: api.dose, cost: (api.dose * api.cost / 1000000) },
        { name: 'BakFiller-01', role: 'Filler', qty: unitW - api.dose - 30, cost: 0.003 },
        { name: 'BakBinder-PRO', role: 'Binder', qty: 30, cost: 0.008 }
    ];

    document.getElementById('resultsArea').style.display = 'block';
    document.getElementById('formulaBody').innerHTML = ings.map(i => `
        <tr><td>${i.name}</td><td>${i.role}</td><td>${i.qty}</td><td>${((i.qty/unitW)*100).toFixed(1)}%</td><td>$${i.cost.toFixed(4)}</td></tr>
    `).join('');

    drawCharts(ings);
}

function drawCharts(ings) {
    const ctxD = document.getElementById('formulaChart').getContext('2d');
    if(charts.donut) charts.donut.destroy();
    charts.donut = new Chart(ctxD, {
        type: 'doughnut',
        data: { labels: ings.map(i=>i.name), datasets: [{data: ings.map(i=>i.qty), backgroundColor:['#0e4b62','#3498db','#2ecc71']}] },
        options: { maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });

    const ctxB = document.getElementById('costComparisonChart').getContext('2d');
    if(charts.bar) charts.bar.destroy();
    charts.bar = new Chart(ctxB, {
        type: 'bar',
        data: { labels: ['Economy Strategy', 'Quality Strategy'], datasets: [{label: 'Cost (USD)', data: [110, 165], backgroundColor: ['#219150', '#0e4b62']}] },
        options: { indexAxis: 'y', maintainAspectRatio: false }
    });
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // 1. العلامة المائية المخصصة للاسم الجديد
    doc.setTextColor(245, 245, 245);
    doc.setFontSize(55);
    doc.text("BakChemformula PRO", 20, 150, { angle: 45 });

    // 2. الترويسة
    doc.setTextColor(14, 75, 98);
    doc.setFontSize(22);
    doc.text("BakChem Technical Report", 105, 20, { align: 'center' });

    // 3. الجدول
    doc.autoTable({
        startY: 40,
        head: [i18n[currentLang].th],
        body: Array.from(document.querySelectorAll('#formulaBody tr')).map(tr => Array.from(tr.querySelectorAll('td')).map(td => td.innerText)),
        headStyles: { fillColor: [14, 75, 98] }
    });

    // 4. الباركود
    const canvas = document.getElementById("barcodeCanvas");
    const barcodeID = "BK-" + Math.floor(Math.random()*900000);
    JsBarcode(canvas, barcodeID, { format: "CODE128", width: 2, height: 40 });
    doc.addImage(canvas.toDataURL("image/png"), 'PNG', 150, 265, 45, 18);

    // 5. الحقوق
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text("© 2026 BakChemformula AI | babuker.github.io/BakChemformula", 105, 290, { align: 'center' });

    doc.save(`${barcodeID}_BakChem_Report.pdf`);
}

setLang('ar');
