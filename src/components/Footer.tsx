export default function Footer() {
  return (
    <footer className="mt-8">
      <div className="bg-[#232f3e]">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div>
            <h3 className="text-white font-bold mb-4">Nexora</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">عن Nexora</li>
              <li className="hover:text-white transition-colors cursor-pointer">المدونة</li>
              <li className="hover:text-white transition-colors cursor-pointer">وظائف</li>
              <li className="hover:text-white transition-colors cursor-pointer">تطبيق Nexora</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">تسوق</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">إلكترونيات</li>
              <li className="hover:text-white transition-colors cursor-pointer">موضة</li>
              <li className="hover:text-white transition-colors cursor-pointer">المنزل والمطبخ</li>
              <li className="hover:text-white transition-colors cursor-pointer">الجمال والعناية</li>
              <li className="hover:text-white transition-colors cursor-pointer">رياضة</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">خدمة العملاء</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">تواصل معنا</li>
              <li className="hover:text-white transition-colors cursor-pointer">مساعدة</li>
              <li className="hover:text-white transition-colors cursor-pointer">الشحن والإرجاع</li>
              <li className="hover:text-white transition-colors cursor-pointer">تتبع الطلب</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">طرق الدفع</h3>
            <div className="flex flex-wrap gap-2">
              <span className="bg-white/10 text-gray-300 px-3 py-1.5 rounded text-xs">الدفع عند الاستلام</span>
              <span className="bg-white/10 text-gray-300 px-3 py-1.5 rounded text-xs">فوري</span>
              <span className="bg-white/10 text-gray-300 px-3 py-1.5 rounded text-xs">بطاقات ائتمان</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#131921] text-center text-sm py-4 text-gray-500">
        © 2026 Nexora. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
