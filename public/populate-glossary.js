// Paste this script into your browser console while on the admin dashboard
// This will populate your glossary with financial terms

const financeTerms = [
  {
    term: "אג״ח (איגרות חוב)",
    definition: "<p>תעודת התחייבות שמנפיקה חברה או מדינה לצורך גיוס כספים מהציבור. הרוכש אג״ח מלווה כסף למנפיק תמורת ריבית והחזר הקרן בסוף התקופה.</p>",
    isPublished: true,
    order: 10
  },
  {
    term: "אינפלציה",
    definition: "<p>עלייה מתמשכת במחירים הכללית של מוצרים ושירותים במשק, המובילה לירידה בכוח הקנייה של הכסף.</p>",
    isPublished: true,
    order: 12
  },
  {
    term: "ביטוח חיים",
    definition: "<p>חוזה בין חברת ביטוח למבוטח, לפיו תשלם חברת הביטוח סכום כסף למוטבים במקרה של מות המבוטח.</p>",
    isPublished: true,
    order: 15
  },
  {
    term: "גרייס",
    definition: "<p>תקופת חסד בתשלומי הלוואה או משכנתא, שבמהלכה הלווה יכול לשלם ריבית בלבד או להפסיק לשלם לחלוטין.</p>",
    isPublished: false,
    order: 18
  },
  {
    term: "דיבידנד",
    definition: "<p>חלוקת רווחים של חברה לבעלי המניות שלה, בדרך כלל בצורת מזומן או מניות נוספות.</p>",
    isPublished: true,
    order: 20
  },
  {
    term: "הון עצמי",
    definition: "<p>סך הנכסים של אדם או חברה פחות התחייבויותיהם. מייצג את הערך הנקי של הבעלות.</p>",
    isPublished: true,
    order: 25
  },
  {
    term: "ויתור על תביעה",
    definition: "<p>הסכם משפטי בו אדם מוותר על זכותו לתבוע צד שלישי בגין נזקים שנגרמו לו.</p>",
    isPublished: false,
    order: 30
  },
  {
    term: "זכות קדימה",
    definition: "<p>הזכות הניתנת לבעלי מניות קיימים לרכוש מניות חדשות לפני שהן מוצעות לציבור הרחב.</p>",
    isPublished: true,
    order: 35
  },
  {
    term: "חיתום",
    definition: "<p>תהליך שבו גוף פיננסי (חתם) לוקח על עצמו אחריות להפצת ניירות ערך של חברה בהנפקה.</p>",
    isPublished: true,
    order: 40
  },
  {
    term: "טווח קצר",
    definition: "<p>השקעה או אסטרטגיה פיננסית המיועדת לפרק זמן קצר, בדרך כלל פחות משנה.</p>",
    isPublished: true,
    order: 45
  },
  {
    term: "יתרת זכות",
    definition: "<p>מצב בחשבון בנק כאשר יש בו כסף פנוי לשימוש. ההפך מיתרת חובה.</p>",
    isPublished: true,
    order: 50
  },
  {
    term: "כלכלת שוק",
    definition: "<p>מערכת כלכלית המבוססת על עקרונות של היצע וביקוש עם התערבות מינימלית של הממשלה.</p>",
    isPublished: false,
    order: 55
  },
  {
    term: "לווה",
    definition: "<p>אדם או גוף שקיבל הלוואה מגורם אחר והתחייב להחזירה בתנאים מסוימים.</p>",
    isPublished: true,
    order: 60
  },
  {
    term: "מדד המחירים לצרכן",
    definition: "<p>מדד המשקף את השינויים במחירים של סל מוצרים ושירותים טיפוסי למשק בית ממוצע.</p>",
    isPublished: true,
    order: 65
  },
  {
    term: "נזילות",
    definition: "<p>המידה שבה ניתן להמיר נכס למזומן במהירות ובקלות, מבלי לפגוע בערכו.</p>",
    isPublished: true,
    order: 70
  },
  {
    term: "סחירות",
    definition: "<p>המידה שבה ניתן לקנות או למכור נכס או נייר ערך בשוק מבלי להשפיע על מחירו.</p>",
    isPublished: true,
    order: 75
  },
  {
    term: "עמלת הפצה",
    definition: "<p>תשלום שמקבל גוף פיננסי בתמורה להפצת מוצרים פיננסיים כמו קרנות נאמנות או ביטוחים.</p>",
    isPublished: false,
    order: 80
  },
  {
    term: "פחת",
    definition: "<p>ירידת ערך של נכס לאורך זמן כתוצאה מבלאי, התיישנות טכנולוגית או גורמים אחרים.</p>",
    isPublished: true,
    order: 85
  },
  {
    term: "צ'ק דחוי",
    definition: "<p>המחאה (צ'ק) שתאריך הפירעון שלה מאוחר מתאריך הרישום והמסירה שלה.</p>",
    isPublished: true,
    order: 90
  },
  {
    term: "קרן נאמנות",
    definition: "<p>מכשיר השקעה המאגד כספים ממשקיעים רבים לצורך השקעה משותפת בתיק מגוון של ניירות ערך.</p>",
    isPublished: true,
    order: 95
  },
  {
    term: "ריבית דריבית",
    definition: "<p>ריבית המחושבת לא רק על הקרן המקורית אלא גם על הריבית שנצברה בתקופות קודמות.</p>",
    isPublished: true,
    order: 100
  },
  {
    term: "שוק ההון",
    definition: "<p>המסגרת שבה מתבצעות פעילויות פיננסיות כמו הנפקת מניות, אגרות חוב ומכשירים פיננסיים אחרים.</p>",
    isPublished: true,
    order: 105
  },
  {
    term: "תשואה",
    definition: "<p>הרווח או ההפסד על השקעה מסוימת, בדרך כלל מבוטא באחוזים מההשקעה המקורית.</p>",
    isPublished: true,
    order: 110
  },
  {
    term: "אופציית רכש",
    definition: "<p>חוזה המעניק למחזיק בו את הזכות, אך לא את החובה, לקנות נכס בסיסי במחיר מוסכם מראש עד תאריך מסוים.</p>",
    isPublished: false,
    order: 115
  },
  {
    term: "ביטחונות",
    definition: "<p>נכסים שמשמשים כערבות להבטחת החזר הלוואה. אם הלווה לא יעמוד בהתחייבויותיו, המלווה יכול לממש את הביטחונות.</p>",
    isPublished: true,
    order: 120
  },
  {
    term: "גידור",
    definition: "<p>אסטרטגיה להגנה מפני סיכוני שוק כמו תנודות מחירים, שערי חליפין או שינויי ריבית.</p>",
    isPublished: true,
    order: 125
  },
  {
    term: "דיפולט",
    definition: "<p>אי-עמידה בתשלום חוב או בתנאים אחרים של הסכם פיננסי.</p>",
    isPublished: false,
    order: 130
  },
  {
    term: "הנפקה ראשונית לציבור (IPO)",
    definition: "<p>תהליך שבו חברה פרטית מציעה לראשונה את מניותיה למכירה לציבור הרחב.</p>",
    isPublished: true,
    order: 135
  },
  {
    term: "ועדת השקעות",
    definition: "<p>קבוצת אנשים האחראית על קבלת החלטות השקעה בגוף מוסדי כמו חברת ביטוח או קרן פנסיה.</p>",
    isPublished: true,
    order: 140
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

// Function to populate all terms with delay
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
    
    // Add a delay to prevent overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`✨ Glossary population completed!`);
  console.log(`✅ Successfully added: ${successCount} terms`);
  console.log(`❌ Failed to add: ${failCount} terms`);
  
  // Reload the page to see the new terms
  console.log('Reloading page in 3 seconds...');
  setTimeout(() => {
    window.location.reload();
  }, 3000);
}

// Run the script
populateGlossary(); 