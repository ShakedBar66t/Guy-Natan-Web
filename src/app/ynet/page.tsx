import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import YnetArticles from '@/components/YnetArticles';

export const metadata = {
  title: 'גיא נתן ב-Ynet | Guy Natan',
  description: 'קטעי עיתונות ומאמרים של גיא נתן ב-Ynet',
};

export default function YnetPage() {
  return (
    <>
      <div className="bg-[#002F42] py-16">
        <MaxWidthWrapper>
          <div className="text-center" dir="rtl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              מאמרים של גיא נתן ב-Ynet
            </h1>
            <p className="text-lg text-white opacity-90 max-w-3xl mx-auto">
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