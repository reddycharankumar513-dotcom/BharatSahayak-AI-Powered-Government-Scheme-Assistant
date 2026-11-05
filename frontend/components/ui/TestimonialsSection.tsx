'use client';

import React from 'react';
import { useLanguage } from '@/lib/language-context';
import { Quote, Sparkles, MapPin, CheckCircle } from 'lucide-react';

export default function TestimonialsSection() {
  const { language, t } = useLanguage();

  const testimonials = [
    {
      name: language === 'te' ? 'రమేష్ గుంటూరు' : 'Ramesh G.',
      location: language === 'te' ? 'గుంటూరు, ఆంధ్రప్రదేశ్' : 'Guntur, Andhra Pradesh',
      role: language === 'te' ? 'చిన్న రైతు (3 ఎకరాలు)' : 'Smallholder Farmer (3 Acres)',
      scheme: 'PM-KISAN & PM Fasal Bima',
      quoteEn: "I was confused about why my PM-KISAN installment stopped. JanSathi explained in Telugu that my e-KYC was pending and gave me the exact step to resolve it at our local CSC centre.",
      quoteTe: "నా పీఎం కిసాన్ కిస్తీ ఎందుకు ఆగిపోయిందో నాకు అర్థం కాలేదు. జన్ సాథి తెలుగులో ఈ-కేవైసీ అసంపూర్ణంగా ఉందని వివరించి, మా గ్రామంలోని సీఎస్‌సీ కేంద్రంలో ఎలా పూర్తి చేయాలో స్పష్టంగా చెప్పింది.",
      avatarBg: 'bg-amber-100 text-amber-800',
    },
    {
      name: language === 'te' ? 'ప్రియా కొడాలి' : 'Priya K.',
      location: language === 'te' ? 'హైదరాబాద్, తెలంగాణ' : 'Hyderabad, Telangana',
      role: language === 'te' ? 'బీటెక్ విద్యార్థిని' : 'B.Tech Engineering Student',
      scheme: 'PM-Vidyalaxmi & Post-Matric Scholarship',
      quoteEn: "Navigating higher education bank loan requirements felt intimidating. The eligibility checker matched me with collateral-free credit schemes without false promises.",
      quoteTe: "ఉన్నత చదువుల కోసం బ్యాంక్ లోన్ నిబంధనలు తెలుసుకోవడం చాలా కష్టంగా ఉండేది. జన్ సాథి నా కుటుంబ ఆదాయానికి సరిపోయే పూచీకత్తు లేని రుణ పథకాలను క్షణాల్లో చూపించింది.",
      avatarBg: 'bg-emerald-100 text-emerald-800',
    },
    {
      name: language === 'te' ? 'సురేష్ వర్మ' : 'Suresh V.',
      location: language === 'te' ? 'వరంగల్, తెలంగాణ' : 'Warangal, Telangana',
      role: language === 'te' ? 'చిరు కిరాణా వ్యాపారి' : 'Kirana Store Entrepreneur',
      scheme: 'PM Mudra Yojana (Kishore Category)',
      quoteEn: "Using Telugu voice input, I asked what documents were needed to expand my shop with a Mudra loan. The personalized document checklist made my bank visit 100% prepared.",
      quoteTe: "తెలుగులో వాయిస్ ద్వారా ముద్రా లోన్ కోసం ఏం కావాలో అడిగాను. అవసరమైన పత్రాల చెక్‌లిస్ట్ ఇవ్వడం వల్ల ఎలాంటి అడ్డంకులు లేకుండా బ్యాంక్‌లో దరఖాస్తు చేయగలిగాను.",
      avatarBg: 'bg-blue-100 text-blue-800',
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-saffron-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-saffron-600" />
            <span>{t.testimonials.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
            {t.testimonials.heading}
          </h2>
          <p className="mt-2 text-base text-slate-600">
            {t.testimonials.subheading}
          </p>

          {/* Demonstration Notice */}
          <div className="mt-3 inline-block px-3 py-1 rounded-md bg-slate-200/80 text-[11px] font-semibold text-slate-700">
            ℹ️ {t.testimonials.demoNotice}
          </div>
        </div>

        {/* Testimonials Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
            >
              <div>
                <Quote className="w-8 h-8 text-saffron-400/80 mb-4" />
                <p className="text-sm text-slate-700 leading-relaxed italic mb-6">
                  "{language === 'te' ? item.quoteTe : item.quoteEn}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3.5">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm ${item.avatarBg} shrink-0`}>
                  {item.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-bold text-navy-900 text-sm truncate">
                    {item.name}
                  </h4>
                  <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-saffron-600" />
                    <span>{item.location}</span>
                  </p>
                  <p className="text-[11px] text-emerald-700 font-semibold truncate flex items-center gap-1 mt-0.5">
                    <CheckCircle className="w-3 h-3" />
                    <span>{item.scheme}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
