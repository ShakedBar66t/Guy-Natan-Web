import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import YnetArticles from '@/components/YnetArticles';

export const metadata = {
  title: 'גיא נתן ב-Ynet | Guy Natan',
  description: 'קטעי עיתונות ומאמרים של גיא נתן ב-Ynet',
};

export default function YnetPage() {
  return (
    <>
      <div className="bg-white py-6 mb-8">
        <MaxWidthWrapper>
          <div className="text-center" dir="rtl">
            <h1 className="text-[#002F42] text-center text-5xl md:text-6xl font-bold mb-2">
              גיא נתן <span className="font-normal">ב-Ynet</span>
            </h1>
            <p className="text-[#002F42] text-lg opacity-90 max-w-3xl mx-auto">
              הטור של גיא נתן כתב Ynet עוסק בהנגשת ידע בתחום הפיננסי להמונים.
              כאן תוכלו למצוא את כל המאמרים שמתפרסמים במדור שוק ההון של Ynet.
            </p>
          </div>
        </MaxWidthWrapper>
      </div>

      <MaxWidthWrapper className="py-12">
        <div className="max-w-4xl mx-auto" dir="rtl">
          <YnetArticles />
        </div>
      </MaxWidthWrapper>
    </>
  );
} 