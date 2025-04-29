/**
 * Populate Glossary Script
 * 
 * This script adds financial terms in Hebrew to the glossary database.
 * Run this script when logged in as an admin.
 */

// Financial terms in Hebrew
const financeTerms = [
  {
    term: "ריבית",
    definition: "<p>תשלום שמשולם על ידי לווה למלווה עבור השימוש בכספו. הריבית משולמת בדרך כלל כאחוז מהסכום שהולווה (הקרן).</p>",
    isPublished: true,
    order: 1,
    category: "בנקאות"
  },
  {
    term: "ריבית דריבית",
    definition: "<p>תהליך בו הריבית מתווספת לקרן ולאחר מכן גם עליה מחושבת ריבית. מכונה גם ריבית מורכבת. אחד המנגנונים החזקים ביותר להגדלת הון לאורך זמן.</p>",
    isPublished: true,
    order: 2,
    category: "בנקאות"
  },
  {
    term: "אינפלציה",
    definition: "<p>עלייה כללית ומתמשכת במחירים של מוצרים ושירותים במשק לאורך זמן. כתוצאה מאינפלציה, ערך הכסף יורד - כלומר, ניתן לקנות פחות מוצרים ושירותים באותו סכום.</p>",
    isPublished: true,
    order: 3,
    category: "מאקרו כלכלה"
  },
  {
    term: "דפלציה",
    definition: "<p>הפחתה כללית ומתמשכת ברמת המחירים של מוצרים ושירותים. הפוך מאינפלציה.</p>",
    isPublished: true,
    order: 4,
    category: "מאקרו כלכלה"
  },
  {
    term: "תיק השקעות",
    definition: "<p>אוסף של נכסים פיננסיים כמו מניות, אגרות חוב, קרנות נאמנות ונכסים אחרים שמוחזקים על ידי משקיע.</p>",
    isPublished: true,
    order: 5,
    category: "השקעות"
  },
  {
    term: "פיזור השקעות",
    definition: "<p>אסטרטגיה להקטנת סיכון על ידי השקעה במגוון נכסים פיננסיים. הרעיון הוא שתיק מגוון היטב יניב תשואות יציבות יותר בטווח הארוך.</p>",
    isPublished: true,
    order: 6,
    category: "השקעות"
  },
  {
    term: "מניה",
    definition: "<p>יחידת בעלות בחברה. כאשר אתה רוכש מניה, אתה הופך לאחד מבעלי החברה.</p>",
    isPublished: true,
    order: 7,
    category: "שוק ההון"
  },
  {
    term: "דיבידנד",
    definition: "<p>חלוקת רווחים של חברה לבעלי המניות שלה. בדרך כלל משולם במזומן, אך יכול להיות גם בצורת מניות נוספות.</p>",
    isPublished: true,
    order: 8,
    category: "שוק ההון"
  },
  {
    term: "אגרת חוב",
    definition: "<p>מכשיר חוב שבו הגוף המנפיק (ממשלה, רשות מקומית או חברה) מתחייב לשלם לבעל האג\"ח ריבית קבועה או משתנה במועדים קבועים, ולפדות את הקרן במועד הפירעון.</p>",
    isPublished: true,
    order: 9,
    category: "שוק ההון"
  },
  {
    term: "קרן נאמנות",
    definition: "<p>מכשיר השקעה המאגד כספים של משקיעים רבים ומשקיע אותם בתיק השקעות מגוון. מנוהלת על ידי מנהל השקעות מקצועי.</p>",
    isPublished: true,
    order: 10,
    category: "השקעות"
  },
  {
    term: "תשואה",
    definition: "<p>הרווח או ההפסד על השקעה, בדרך כלל מבוטא כאחוז מסכום ההשקעה המקורי.</p>",
    isPublished: true,
    order: 11,
    category: "השקעות"
  },
  {
    term: "סיכון",
    definition: "<p>האפשרות להפסד כספי או אי-וודאות לגבי תשואה עתידית. ככל שהסיכון גבוה יותר, התשואה הפוטנציאלית גבוהה יותר בדרך כלל, אך גם הסיכוי להפסד גדל.</p>",
    isPublished: true,
    order: 12,
    category: "השקעות"
  },
  {
    term: "ליקווידיות",
    definition: "<p>המידה שבה ניתן למכור נכס במהירות מבלי להשפיע על מחירו. נכס בעל נזילות גבוהה ניתן למכור במהירות במחיר השוק.</p>",
    isPublished: true,
    order: 13,
    category: "השקעות"
  },
  {
    term: "שער חליפין",
    definition: "<p>המחיר של מטבע אחד במונחים של מטבע אחר.</p>",
    isPublished: true,
    order: 14,
    category: "פורקס"
  },
  {
    term: "תמ\"ג",
    definition: "<p>תוצר מקומי גולמי - הערך הכולל של כל הסחורות והשירותים שיוצרו בתוך גבולות המדינה בתקופה מסוימת.</p>",
    isPublished: true,
    order: 15,
    category: "מאקרו כלכלה"
  },
  {
    term: "אבטלה",
    definition: "<p>מצב בו אנשים המעוניינים ומסוגלים לעבוד אינם מוצאים עבודה.</p>",
    isPublished: true,
    order: 16,
    category: "מאקרו כלכלה"
  },
  {
    term: "מדד המחירים לצרכן",
    definition: "<p>מדד המשקף את השינויים במחירים של סל מוצרים ושירותים שנרכשים על ידי משקי בית. משמש למדידת האינפלציה.</p>",
    isPublished: true,
    order: 17,
    category: "מאקרו כלכלה"
  },
  {
    term: "תקציב",
    definition: "<p>תכנית כלכלית המפרטת את ההכנסות וההוצאות הצפויות לתקופה מסוימת.</p>",
    isPublished: true,
    order: 18,
    category: "תכנון פיננסי"
  },
  {
    term: "יחס חוב-הכנסה",
    definition: "<p>היחס בין סך החובות החודשיים לבין ההכנסה החודשית ברוטו. משמש להערכת כושר ההחזר של הלווה.</p>",
    isPublished: true,
    order: 19,
    category: "תכנון פיננסי"
  },
  {
    term: "משכנתא",
    definition: "<p>הלוואה לרכישת נדל\"ן, כאשר הנכס עצמו משמש כבטוחה להלוואה.</p>",
    isPublished: true,
    order: 20,
    category: "נדל\"ן"
  },
  {
    term: "תשואה על השקעה (ROI)",
    definition: "<p>מדד המשמש להערכת יעילות או רווחיות של השקעה. מחושב כיחס בין הרווח הנקי להשקעה, מבוטא באחוזים.</p>",
    isPublished: true,
    order: 21,
    category: "השקעות"
  },
  {
    term: "ניתוח בסיסי",
    definition: "<p>שיטה להערכת מניה על ידי בחינת נתונים כלכליים ופיננסיים של החברה, כגון דוחות כספיים, רווחיות, יתרונות תחרותיים וכד'.</p>",
    isPublished: true,
    order: 22,
    category: "שוק ההון"
  },
  {
    term: "ניתוח טכני",
    definition: "<p>שיטה לחיזוי מחירי מניות על סמך בחינת דפוסי מסחר ומחירים היסטוריים.</p>",
    isPublished: true,
    order: 23,
    category: "שוק ההון"
  },
  {
    term: "קרן פנסיה",
    definition: "<p>תכנית חיסכון ארוכת טווח המיועדת לספק הכנסה לאחר פרישה.</p>",
    isPublished: true,
    order: 24,
    category: "חיסכון פנסיוני"
  },
  {
    term: "קופת גמל",
    definition: "<p>מכשיר חיסכון לטווח ארוך שמטרתו לצבור כספים שיעמדו לרשות החוסך בעת פרישה או למטרות אחרות.</p>",
    isPublished: true,
    order: 25,
    category: "חיסכון פנסיוני"
  }
];

// Function to add terms one by one
async function addTerm(term) {
  const url = '/api/admin/glossary';
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(term),
      credentials: 'include'
    });
    
    if (response.ok) {
      console.log(`✅ Added term: ${term.term}`);
      return true;
    } else {
      const errorData = await response.json();
      console.error(`❌ Failed to add term: ${term.term}`, errorData);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error adding term: ${term.term}`, error);
    return false;
  }
}

// Main function to populate glossary
async function populateGlossary() {
  console.log(`Starting to populate glossary with ${financeTerms.length} terms...`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const term of financeTerms) {
    const success = await addTerm(term);
    
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
    
    // Small delay to prevent overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log('\n✨ Glossary population completed!');
  console.log(`✅ Successfully added: ${successCount} terms`);
  
  if (failCount > 0) {
    console.log(`❌ Failed to add: ${failCount} terms`);
  }
}

// Export for importing in other files if needed
export { populateGlossary, financeTerms }; 