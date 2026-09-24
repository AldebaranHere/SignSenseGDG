// src/data/curriculum.js
// Auslan SignSense Curriculum Definition
// Units, Lessons, Signs, and Demonstration Assets

export const CURRICULUM = {
  units: [
    {
      id: "unit-1",
      slug: "fingerspelling",
      title: "Fingerspelling & Alphabet",
      shortTitle: "Fingerspelling",
      category: "ALPHABET",
      description: "Learn the traditional Auslan two-handed manual alphabet (A-Z).",
      totalLessons: 6,
      lessons: [
        {
          id: "fs-1",
          title: "Vowels (A, E, I, O, U)",
          unitSlug: "fingerspelling",
          unitTitle: "Fingerspelling",
          category: "ALPHABET · VOWELS",
          sentenceLabel: "Auslan Vowels · 5 signs",
          translation: "Dominant index points to thumb, index, middle, ring, and pinky of base hand.",
          signs: [
            {
              id: "A",
              gloss: "A",
              name: "Letter A",
              type: "image",
              mediaUrl: "public/assets/images/alphabet/th_a.jpg",
              description: "Touch the tip of your non-dominant thumb with your dominant index finger.",
              signbankUrl: "https://auslan.org.au/spell/twohanded.html",
              signNumber: 1,
              totalSigns: 5
            },
            {
              id: "E",
              gloss: "E",
              name: "Letter E",
              type: "image",
              mediaUrl: "public/assets/images/alphabet/th_e.jpg",
              description: "Touch the tip of your non-dominant index finger with your dominant index finger.",
              signbankUrl: "https://auslan.org.au/spell/twohanded.html",
              signNumber: 2,
              totalSigns: 5
            },
            {
              id: "I",
              gloss: "I",
              name: "Letter I",
              type: "image",
              mediaUrl: "public/assets/images/alphabet/th_i.jpg",
              description: "Touch the tip of your non-dominant middle finger with your dominant index finger.",
              signbankUrl: "https://auslan.org.au/spell/twohanded.html",
              signNumber: 3,
              totalSigns: 5
            },
            {
              id: "O",
              gloss: "O",
              name: "Letter O",
              type: "image",
              mediaUrl: "public/assets/images/alphabet/th_o.jpg",
              description: "Touch the tip of your non-dominant ring finger with your dominant index finger.",
              signbankUrl: "https://auslan.org.au/spell/twohanded.html",
              signNumber: 4,
              totalSigns: 5
            },
            {
              id: "U",
              gloss: "U",
              name: "Letter U",
              type: "image",
              mediaUrl: "public/assets/images/alphabet/th_u.jpg",
              description: "Touch the tip of your non-dominant pinky finger with your dominant index finger.",
              signbankUrl: "https://auslan.org.au/spell/twohanded.html",
              signNumber: 5,
              totalSigns: 5
            }
          ]
        },
        {
          id: "fs-2",
          title: "First Consonants (B, C, D, F, G)",
          unitSlug: "fingerspelling",
          unitTitle: "Fingerspelling",
          category: "ALPHABET · CONSONANTS",
          sentenceLabel: "Consonants B to G · 5 signs",
          translation: "Two-handed formations for B, C, D, F, and G.",
          signs: [
            {
              id: "B",
              gloss: "B",
              name: "Letter B",
              type: "image",
              mediaUrl: "public/assets/images/alphabet/th_b.jpg",
              description: "Touch thumbs and index fingers of both hands together to form two circles (spectacles).",
              signbankUrl: "https://auslan.org.au/spell/twohanded.html",
              signNumber: 1,
              totalSigns: 5
            },
            {
              id: "C",
              gloss: "C",
              name: "Letter C",
              type: "image",
              mediaUrl: "public/assets/images/alphabet/th_c.jpg",
              description: "Curve thumb and fingers of dominant hand to form a 'C' shape.",
              signbankUrl: "https://auslan.org.au/spell/twohanded.html",
              signNumber: 2,
              totalSigns: 5
            },
            {
              id: "D",
              gloss: "D",
              name: "Letter D",
              type: "image",
              mediaUrl: "public/assets/images/alphabet/th_d.jpg",
              description: "Touch dominant thumb and index finger against extended non-dominant index finger.",
              signbankUrl: "https://auslan.org.au/spell/twohanded.html",
              signNumber: 3,
              totalSigns: 5
            },
            {
              id: "F",
              gloss: "F",
              name: "Letter F",
              type: "image",
              mediaUrl: "public/assets/images/alphabet/th_f.jpg",
              description: "Extend index and middle fingers of both hands, placing dominant across non-dominant.",
              signbankUrl: "https://auslan.org.au/spell/twohanded.html",
              signNumber: 4,
              totalSigns: 5
            },
            {
              id: "G",
              gloss: "G",
              name: "Letter G",
              type: "image",
              mediaUrl: "public/assets/images/alphabet/th_g.jpg",
              description: "Place both closed fists together, one on top of the other.",
              signbankUrl: "https://auslan.org.au/spell/twohanded.html",
              signNumber: 5,
              totalSigns: 5
            }
          ]
        },
        {
          id: "fs-3",
          title: "Mid Consonants (H, J, K, L, M, N)",
          unitSlug: "fingerspelling",
          unitTitle: "Fingerspelling",
          category: "ALPHABET · CONSONANTS",
          sentenceLabel: "Consonants H to N · 6 signs",
          translation: "Two-handed formations for H, J, K, L, M, and N.",
          signs: [
            {
              id: "H",
              gloss: "H",
              name: "Letter H",
              type: "image",
              mediaUrl: "public/assets/images/alphabet/th_h.jpg",
              description: "Flat dominant palm sweeps forward across flat non-dominant palm.",
              signbankUrl: "https://auslan.org.au/spell/twohanded.html",
              signNumber: 1,
              totalSigns: 6
            },
            {
              id: "J",
              gloss: "J",
              name: "Letter J",
              type: "image",
              mediaUrl: "public/assets/images/alphabet/th_j.jpg",
              description: "Dominant index traces along non-dominant palm and curls up the middle finger.",
              signbankUrl: "https://auslan.org.au/spell/twohanded.html",
              signNumber: 2,
              totalSigns: 6
            },
            {
              id: "K",
              gloss: "K",
              name: "Letter K",
              type: "image",
              mediaUrl: "public/assets/images/alphabet/th_k.jpg",
              description: "Bend dominant index finger across upright non-dominant index finger.",
              signbankUrl: "https://auslan.org.au/spell/twohanded.html",
              signNumber: 3,
              totalSigns: 6
            },
            {
              id: "L",
              gloss: "L",
              name: "Letter L",
              type: "image",
              mediaUrl: "public/assets/images/alphabet/th_l.jpg",
              description: "Dominant index lies flat across open non-dominant palm.",
              signbankUrl: "https://auslan.org.au/spell/twohanded.html",
              signNumber: 4,
              totalSigns: 6
            },
            {
              id: "M",
              gloss: "M",
              name: "Letter M",
              type: "image",
              mediaUrl: "public/assets/images/alphabet/th_m.jpg",
              description: "Place three dominant fingers (index, middle, ring) on non-dominant palm.",
              signbankUrl: "https://auslan.org.au/spell/twohanded.html",
              signNumber: 5,
              totalSigns: 6
            },
            {
              id: "N",
              gloss: "N",
              name: "Letter N",
              type: "image",
              mediaUrl: "public/assets/images/alphabet/th_n.jpg",
              description: "Place two dominant fingers (index and middle) on non-dominant palm.",
              signbankUrl: "https://auslan.org.au/spell/twohanded.html",
              signNumber: 6,
              totalSigns: 6
            }
          ]
        },
        {
          id: "fs-4",
          title: "Upper Consonants (P, Q, R, S, T)",
          unitSlug: "fingerspelling",
          unitTitle: "Fingerspelling",
          category: "ALPHABET · CONSONANTS",
          sentenceLabel: "Consonants P to T · 5 signs",
          translation: "Two-handed formations for P, Q, R, S, and T.",
          signs: [
            {
              id: "P",
              gloss: "P",
              name: "Letter P",
              type: "image",
              mediaUrl: "public/assets/images/alphabet/th_p.jpg",
              description: "Touch index and thumb of dominant hand to upright non-dominant index to form a P loop.",
              signbankUrl: "https://auslan.org.au/spell/twohanded.html",
              signNumber: 1,
              totalSigns: 5
            },
            {
              id: "Q",
              gloss: "Q",
              name: "Letter Q",
              type: "image",
              mediaUrl: "public/assets/images/alphabet/th_q.jpg",
              description: "Hook dominant index through circle formed by non-dominant index and thumb.",
              signbankUrl: "https://auslan.org.au/spell/twohanded.html",
              signNumber: 2,
              totalSigns: 5
            },
            {
              id: "R",
              gloss: "R",
              name: "Letter R",
              type: "image",
              mediaUrl: "public/assets/images/alphabet/th_r.jpg",
              description: "Hook dominant curved index finger across non-dominant upright index finger.",
              signbankUrl: "https://auslan.org.au/spell/twohanded.html",
              signNumber: 3,
              totalSigns: 5
            },
            {
              id: "S",
              gloss: "S",
              name: "Letter S",
              type: "image",
              mediaUrl: "public/assets/images/alphabet/th_s.jpg",
              description: "Hook dominant pinky finger around non-dominant pinky finger.",
              signbankUrl: "https://auslan.org.au/spell/twohanded.html",
              signNumber: 4,
              totalSigns: 5
            },
            {
              id: "T",
              gloss: "T",
              name: "Letter T",
              type: "image",
              mediaUrl: "public/assets/images/alphabet/th_t.jpg",
              description: "Touch dominant index finger against lower edge of non-dominant palm near the wrist.",
              signbankUrl: "https://auslan.org.au/spell/twohanded.html",
              signNumber: 5,
              totalSigns: 5
            }
          ]
        },
        {
          id: "fs-5",
          title: "Final Consonants (V, W, X, Y, Z)",
          unitSlug: "fingerspelling",
          unitTitle: "Fingerspelling",
          category: "ALPHABET · CONSONANTS",
          sentenceLabel: "Consonants V to Z · 5 signs",
          translation: "Two-handed formations for V, W, X, Y, and Z.",
          signs: [
            {
              id: "V",
              gloss: "V",
              name: "Letter V",
              type: "image",
              mediaUrl: "public/assets/images/alphabet/th_v.jpg",
              description: "Form a 'V' shape with dominant index and middle fingers on non-dominant palm.",
              signbankUrl: "https://auslan.org.au/spell/twohanded.html",
              signNumber: 1,
              totalSigns: 5
            },
            {
              id: "W",
              gloss: "W",
              name: "Letter W",
              type: "image",
              mediaUrl: "public/assets/images/alphabet/th_w.jpg",
              description: "Interlock fingers of both open hands pointing upward.",
              signbankUrl: "https://auslan.org.au/spell/twohanded.html",
              signNumber: 2,
              totalSigns: 5
            },
            {
              id: "X",
              gloss: "X",
              name: "Letter X",
              type: "image",
              mediaUrl: "public/assets/images/alphabet/th_x.jpg",
              description: "Cross dominant index finger over non-dominant index finger to form an X.",
              signbankUrl: "https://auslan.org.au/spell/twohanded.html",
              signNumber: 3,
              totalSigns: 5
            },
            {
              id: "Y",
              gloss: "Y",
              name: "Letter Y",
              type: "image",
              mediaUrl: "public/assets/images/alphabet/th_y.jpg",
              description: "Dominant index rests in crook between non-dominant thumb and index finger.",
              signbankUrl: "https://auslan.org.au/spell/twohanded.html",
              signNumber: 4,
              totalSigns: 5
            },
            {
              id: "Z",
              gloss: "Z",
              name: "Letter Z",
              type: "image",
              mediaUrl: "public/assets/images/alphabet/th_z.jpg",
              description: "Dominant bent hand rests against upright non-dominant palm.",
              signbankUrl: "https://auslan.org.au/spell/twohanded.html",
              signNumber: 5,
              totalSigns: 5
            }
          ]
        },
        {
          id: "fs-6",
          title: "Full Alphabet (A - Z)",
          unitSlug: "fingerspelling",
          unitTitle: "Fingerspelling",
          category: "ALPHABET · MASTERY",
          sentenceLabel: "Fingerspelling Master Run · 26 signs",
          translation: "Cycle through the entire 26-letter Auslan alphabet.",
          signs: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((ch, idx) => ({
            id: ch,
            gloss: ch,
            name: `Letter ${ch}`,
            type: "image",
            mediaUrl: `public/assets/images/alphabet/th_${ch.toLowerCase()}.jpg`,
            description: `Auslan fingerspelling handshape for letter ${ch}.`,
            signbankUrl: "https://auslan.org.au/spell/twohanded.html",
            signNumber: idx + 1,
            totalSigns: 26
          }))
        }
      ]
    },
    {
      id: "unit-2",
      slug: "greetings",
      title: "Greetings & Essentials",
      shortTitle: "Greetings",
      category: "CONVERSATION",
      description: "Fundamental Auslan conversational signs and polite responses.",
      totalLessons: 4,
      lessons: [
        {
          id: "greet-1",
          title: "Are you good?",
          unitSlug: "greetings",
          unitTitle: "Greetings",
          category: "GREETINGS · SENTENCE 1",
          sentenceLabel: "Greetings · Sentence 1 of 4",
          translation: "\"Are you doing well?\"",
          signs: [
            {
              id: "YOU",
              gloss: "YOU",
              name: "You",
              type: "video",
              mediaUrl: "public/assets/videos/signs/you.mp4",
              description: "Point your dominant index finger forward toward the person you are addressing.",
              signbankUrl: "https://auslan.org.au/dictionary/words/you-1.html",
              signNumber: 1,
              totalSigns: 2
            },
            {
              id: "GOOD",
              gloss: "GOOD",
              name: "Good",
              type: "video",
              mediaUrl: "public/assets/videos/signs/good.mp4",
              description: "Give a crisp thumbs-up with your dominant hand moving slightly forward.",
              signbankUrl: "https://auslan.org.au/dictionary/words/good-1.html",
              signNumber: 2,
              totalSigns: 2
            }
          ]
        },
        {
          id: "greet-2",
          title: "It's okay, sorry",
          unitSlug: "greetings",
          unitTitle: "Greetings",
          category: "GREETINGS · SENTENCE 2",
          sentenceLabel: "Greetings · Sentence 2 of 4",
          translation: "\"Everything is okay, my apologies.\"",
          signs: [
            {
              id: "OKAY",
              gloss: "OKAY",
              name: "Okay",
              type: "video",
              mediaUrl: "public/assets/videos/signs/okay.mp4",
              description: "Form an 'O' with thumb and fingers, or fingerspell O-K.",
              signbankUrl: "https://auslan.org.au/dictionary/words/okay-1.html",
              signNumber: 1,
              totalSigns: 2
            },
            {
              id: "SORRY",
              gloss: "SORRY",
              name: "Sorry",
              type: "video",
              mediaUrl: "public/assets/videos/signs/sorry.mp4",
              description: "Closed fist rubbing in a small circular motion over the chest.",
              signbankUrl: "https://auslan.org.au/dictionary/words/sorry-1.html",
              signNumber: 2,
              totalSigns: 2
            }
          ]
        },
        {
          id: "greet-3",
          title: "Need more help",
          unitSlug: "greetings",
          unitTitle: "Greetings",
          category: "GREETINGS · SENTENCE 3",
          sentenceLabel: "Greetings · Sentence 3 of 4",
          translation: "\"Could you give me more help?\"",
          signs: [
            {
              id: "HELP",
              gloss: "HELP",
              name: "Help",
              type: "video",
              mediaUrl: "public/assets/videos/signs/help.mp4",
              description: "Dominant fist rests thumbs-up on flat non-dominant palm, moving upward together.",
              signbankUrl: "https://auslan.org.au/dictionary/words/help-1.html",
              signNumber: 1,
              totalSigns: 2
            },
            {
              id: "MORE",
              gloss: "MORE",
              name: "More",
              type: "video",
              mediaUrl: "public/assets/videos/signs/more.mp4",
              description: "Bring fingertips together and tap repeatedly against the non-dominant palm/hand.",
              signbankUrl: "https://auslan.org.au/dictionary/words/more-1.html",
              signNumber: 2,
              totalSigns: 2
            }
          ]
        },
        {
          id: "greet-4",
          title: "Stop, that's bad, no",
          unitSlug: "greetings",
          unitTitle: "Greetings",
          category: "GREETINGS · SENTENCE 4",
          sentenceLabel: "Greetings · Sentence 4 of 4",
          translation: "\"Stop doing that, it's not good.\"",
          signs: [
            {
              id: "STOP",
              gloss: "STOP",
              name: "Stop",
              type: "video",
              mediaUrl: "public/assets/videos/signs/stop.mp4",
              description: "Dominant hand brings open blade of hand firmly down onto open non-dominant palm.",
              signbankUrl: "https://auslan.org.au/dictionary/words/stop-1.html",
              signNumber: 1,
              totalSigns: 3
            },
            {
              id: "BAD",
              gloss: "BAD",
              name: "Bad",
              type: "video",
              mediaUrl: "public/assets/videos/signs/bad.mp4",
              description: "Dominant pinky extended outward with downward motion, or thumb down.",
              signbankUrl: "https://auslan.org.au/dictionary/words/bad-1.html",
              signNumber: 2,
              totalSigns: 3
            },
            {
              id: "NO",
              gloss: "NO",
              name: "No",
              type: "video",
              mediaUrl: "public/assets/videos/signs/no.mp4",
              description: "Dominant index and middle finger snap down onto thumb or shake side to side.",
              signbankUrl: "https://auslan.org.au/dictionary/words/no-1.html",
              signNumber: 3,
              totalSigns: 3
            }
          ]
        }
      ]
    },
    {
      id: "unit-3",
      slug: "food-drink",
      title: "Eating & Drinking",
      shortTitle: "Food & drink",
      category: "DAILY LIFE",
      description: "Signs related to dining, food, beverages, and meals.",
      totalLessons: 4,
      lessons: [
        {
          id: "food-1",
          title: "Eating & drinking 1",
          unitSlug: "food-drink",
          unitTitle: "Food & drink",
          category: "FOOD & DRINK",
          sentenceLabel: "Eating & drinking · Sentence 1 of 2",
          translation: "\"I'm eating an apple.\"",
          signs: [
            {
              id: "I",
              gloss: "I",
              name: "I",
              type: "video",
              mediaUrl: "public/assets/videos/signs/I.mp4",
              description: "Point to the centre of your chest with your dominant index finger.",
              signbankUrl: "https://auslan.org.au/dictionary/words/I-1.html",
              signNumber: 1,
              totalSigns: 3
            },
            {
              id: "EAT",
              gloss: "EAT",
              name: "Eat",
              type: "video",
              mediaUrl: "public/assets/videos/signs/eat.mp4",
              description: "Bring clustered fingertips of dominant hand repeatedly toward mouth.",
              signbankUrl: "https://auslan.org.au/dictionary/words/eat-1.html",
              signNumber: 2,
              totalSigns: 3
            },
            {
              id: "APPLE",
              gloss: "APPLE",
              name: "Apple",
              type: "video",
              mediaUrl: "public/assets/videos/signs/apple.mp4",
              description: "Twist knuckle of bent dominant index finger against cheek near corner of mouth.",
              signbankUrl: "https://auslan.org.au/dictionary/words/apple-1.html",
              signNumber: 3,
              totalSigns: 3
            }
          ]
        },
        {
          id: "food-2",
          title: "Water & drinks",
          unitSlug: "food-drink",
          unitTitle: "Food & drink",
          category: "FOOD & DRINK",
          sentenceLabel: "Food & drink · Sentence 2 of 2",
          translation: "\"Drink water please.\"",
          signs: [
            {
              id: "WATER",
              gloss: "WATER",
              name: "Water",
              type: "video",
              mediaUrl: "public/assets/videos/signs/water.mp4",
              description: "Tap chin twice with the side of dominant index finger.",
              signbankUrl: "https://auslan.org.au/dictionary/words/water-1.html",
              signNumber: 1,
              totalSigns: 2
            },
            {
              id: "DRINK",
              gloss: "DRINK",
              name: "Drink",
              type: "video",
              mediaUrl: "public/assets/videos/signs/drink.mp4",
              description: "Form a cup with hand and tip toward mouth as if drinking.",
              signbankUrl: "https://auslan.org.au/dictionary/words/drink-1.html",
              signNumber: 2,
              totalSigns: 2
            }
          ]
        }
      ]
    },
    {
      id: "unit-4",
      slug: "family-home",
      title: "Family & Home",
      shortTitle: "Family",
      category: "PEOPLE & PLACES",
      description: "Signs for family members, feelings, and places in daily life.",
      totalLessons: 4,
      lessons: [
        {
          id: "fam-1",
          title: "I am home",
          unitSlug: "family-home",
          unitTitle: "Family & Home",
          category: "HOME · SENTENCE 1",
          sentenceLabel: "Home · Sentence 1 of 2",
          translation: "\"I am at home now.\"",
          signs: [
            {
              id: "I",
              gloss: "I",
              name: "I",
              type: "video",
              mediaUrl: "public/assets/videos/signs/I.mp4",
              description: "Point to chest with index finger.",
              signbankUrl: "https://auslan.org.au/dictionary/words/I-1.html",
              signNumber: 1,
              totalSigns: 2
            },
            {
              id: "HOME",
              gloss: "HOME",
              name: "Home",
              type: "video",
              mediaUrl: "public/assets/videos/signs/home.mp4",
              description: "Form a roof shape with palms of both hands touching at fingertips.",
              signbankUrl: "https://auslan.org.au/dictionary/words/home-1.html",
              signNumber: 2,
              totalSigns: 2
            }
          ]
        },
        {
          id: "fam-2",
          title: "At school",
          unitSlug: "family-home",
          unitTitle: "Family & Home",
          category: "HOME · SENTENCE 2",
          sentenceLabel: "School · Sentence 2 of 2",
          translation: "\"Currently at school.\"",
          signs: [
            {
              id: "AT",
              gloss: "AT",
              name: "At",
              type: "video",
              mediaUrl: "public/assets/videos/signs/at.mp4",
              description: "Tap dominant fingers downward.",
              signbankUrl: "https://auslan.org.au/dictionary/words/at-1.html",
              signNumber: 1,
              totalSigns: 2
            },
            {
              id: "SCHOOL",
              gloss: "SCHOOL",
              name: "School",
              type: "video",
              mediaUrl: "public/assets/videos/signs/school.mp4",
              description: "Clap dominant palm twice on back of non-dominant hand.",
              signbankUrl: "https://auslan.org.au/dictionary/words/school-1.html",
              signNumber: 2,
              totalSigns: 2
            }
          ]
        }
      ]
    },
    {
      id: "unit-5",
      slug: "numbers",
      title: "Numbers & Direction",
      shortTitle: "Numbers",
      category: "CONCEPTS",
      description: "Auslan numbers, counting, and directional references.",
      totalLessons: 4,
      lessons: [
        {
          id: "num-1",
          title: "Counting 1 to 5",
          unitSlug: "numbers",
          unitTitle: "Numbers",
          category: "NUMBERS · 1 TO 5",
          sentenceLabel: "Numbers · Lesson 1 of 4",
          translation: "\"Auslan numeral counting 1, 2, 3, 4, 5.\"",
          signs: [
            {
              id: "1",
              gloss: "ONE",
              name: "1",
              type: "image",
              mediaUrl: "public/assets/images/yes.png",
              description: "Dominant index finger extended upright.",
              signbankUrl: "https://auslan.org.au/numbersigns.html",
              signNumber: 1,
              totalSigns: 3
            },
            {
              id: "2",
              gloss: "TWO",
              name: "2",
              type: "image",
              mediaUrl: "public/assets/images/yes.png",
              description: "Dominant index and middle finger extended upright.",
              signbankUrl: "https://auslan.org.au/numbersigns.html",
              signNumber: 2,
              totalSigns: 3
            },
            {
              id: "3",
              gloss: "THREE",
              name: "3",
              type: "image",
              mediaUrl: "public/assets/images/yes.png",
              description: "Thumb, index, and middle finger extended upright.",
              signbankUrl: "https://auslan.org.au/numbersigns.html",
              signNumber: 3,
              totalSigns: 3
            }
          ]
        }
      ]
    }
  ]
};

// Helper: Flatten all lessons
export function getAllLessons() {
  const all = [];
  CURRICULUM.units.forEach(u => {
    u.lessons.forEach(l => {
      all.push(l);
    });
  });
  return all;
}

// Helper: Find lesson by ID
export function getLessonById(id) {
  return getAllLessons().find(l => l.id === id) || CURRICULUM.units[0].lessons[0];
}
