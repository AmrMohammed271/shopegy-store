export default function Footer() {
  return (
    <footer className="mt-12 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/10 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
        <div className="animate-fade-in-up">
          <h3 className="text-xl font-bold mb-4">
            <span className="gradient-text">Nexora</span>
            <span className="text-white"> E-Shop</span>
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            أكبر متجر إلكتروني في مصر. نقدم أفضل المنتجات بأفضل الأسعار مع توصيل سريع لجميع المحافظات.
          </p>
        </div>
        <div className="animate-fade-in-up delay-100">
          <h3 className="text-white font-bold mb-3">روابط سريعة</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="hover:text-purple-400 transition-colors cursor-pointer">عن Nexora</li>
            <li className="hover:text-purple-400 transition-colors cursor-pointer">المدونة</li>
            <li className="hover:text-purple-400 transition-colors cursor-pointer">وظائف</li>
            <li className="hover:text-purple-400 transition-colors cursor-pointer">الشحن والإرجاع</li>
          </ul>
        </div>
        <div className="animate-fade-in-up delay-200">
          <h3 className="text-white font-bold mb-3">خدمة العملاء</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="hover:text-purple-400 transition-colors cursor-pointer">تواصل معنا</li>
            <li className="hover:text-purple-400 transition-colors cursor-pointer">مساعدة</li>
            <li className="hover:text-purple-400 transition-colors cursor-pointer">الأسئلة الشائعة</li>
            <li className="hover:text-purple-400 transition-colors cursor-pointer">تتبع الطلب</li>
          </ul>
        </div>
        <div className="animate-fade-in-up delay-300">
          <h3 className="text-white font-bold mb-3">طرق الدفع</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>الدفع عند الاستلام</li>
            <li>فوري</li>
            <li>بطاقات ائتمان</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 text-center text-sm py-4 text-gray-500 relative z-10">
        © 2026 <span className="text-purple-400">Nexora E-Shop</span>. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
