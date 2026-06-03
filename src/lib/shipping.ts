// Egyptian governorates shipping rates
const shippingData = [
  // القاهرة الكبرى
  { id: "cairo", name: "القاهرة", zone: "A", standard: 35, express: 60 },
  { id: "giza", name: "الجيزة", zone: "A", standard: 35, express: 60 },
  { id: "qalyubia", name: "القليوبية", zone: "A", standard: 35, express: 60 },
  // الإسكندرية والوجه البحري
  { id: "alexandria", name: "الإسكندرية", zone: "B", standard: 45, express: 75 },
  { id: "beheira", name: "البحيرة", zone: "B", standard: 45, express: 75 },
  { id: "dakahlia", name: "الدقهلية", zone: "B", standard: 45, express: 75 },
  { id: "sharqia", name: "الشرقية", zone: "B", standard: 45, express: 75 },
  { id: "gharbia", name: "الغربية", zone: "B", standard: 45, express: 75 },
  { id: "monufia", name: "المنوفية", zone: "B", standard: 45, express: 75 },
  { id: "damietta", name: "دمياط", zone: "B", standard: 45, express: 75 },
  { id: "portsaid", name: "بورسعيد", zone: "B", standard: 45, express: 75 },
  { id: "ismailia", name: "الإسماعيلية", zone: "B", standard: 45, express: 75 },
  { id: "suez", name: "السويس", zone: "B", standard: 45, express: 75 },
  { id: "kafr-elsheikh", name: "كفر الشيخ", zone: "B", standard: 50, express: 80 },
  // الصعيد
  { id: "minya", name: "المنيا", zone: "C", standard: 55, express: 90 },
  { id: "asyut", name: "أسيوط", zone: "C", standard: 55, express: 90 },
  { id: "sohag", name: "سوهاج", zone: "C", standard: 55, express: 90 },
  { id: "qena", name: "قنا", zone: "C", standard: 60, express: 95 },
  { id: "luxor", name: "الأقصر", zone: "C", standard: 60, express: 95 },
  { id: "aswan", name: "أسوان", zone: "C", standard: 65, express: 100 },
  { id: "fayoum", name: "الفيوم", zone: "C", standard: 55, express: 90 },
  { id: "bensuef", name: "بني سويف", zone: "C", standard: 55, express: 90 },
  // الصحراء والحدود
  { id: "red-sea", name: "البحر الأحمر", zone: "D", standard: 70, express: 120 },
  { id: "matrouh", name: "مطروح", zone: "D", standard: 70, express: 120 },
  { id: "north-sinai", name: "شمال سيناء", zone: "D", standard: 75, express: 130 },
  { id: "south-sinai", name: "جنوب سيناء", zone: "D", standard: 80, express: 140 },
  { id: "new-valley", name: "الوادي الجديد", zone: "D", standard: 85, express: 150 },
];

export default shippingData;
