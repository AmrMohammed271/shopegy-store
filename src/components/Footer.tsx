export default function Footer() {
  return (
    <footer className="bg-[#232f3e] text-gray-300 mt-8">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <h3 className="text-white font-bold mb-3">تعرف علينا</h3>
          <ul className="space-y-1 text-sm">
            <li>عن ShopEgy</li>
            <li>وظائف</li>
            <li>المدونة</li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-bold mb-3">ربح المال</h3>
          <ul className="space-y-1 text-sm">
            <li>بيع على ShopEgy</li>
            <li>برنامج التسويق بالعمولة</li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-bold mb-3">خدمة العملاء</h3>
          <ul className="space-y-1 text-sm">
            <li>مساعدة</li>
            <li>الشحن والإرجاع</li>
            <li>تواصل معنا</li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-bold mb-3">طرق الدفع</h3>
          <ul className="space-y-1 text-sm">
            <li>الدفع عند الاستلام</li>
            <li>بطاقات ائتمان</li>
            <li>محافظ إلكترونية</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 text-center text-sm py-4">
        © 2026 ShopEgy. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
