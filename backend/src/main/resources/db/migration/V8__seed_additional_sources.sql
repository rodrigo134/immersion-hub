-- Additional source seeds added after V7 was already applied.
-- Uses name + language guards to avoid inserting obvious duplicates.

INSERT INTO sources (id, name, url, description, category, language)
SELECT
  gen_random_uuid(),
  v.name,
  v.url,
  v.description,
  v.category,
  v.language
FROM (
  VALUES
    ('Radio Garden', 'https://radio.garden/', 'Live radio stations from around the world for real-language immersion.', 'LISTENING', 'ENGLISH'),
    ('TV Garden', 'https://tv.garden/', 'Live TV channels from multiple countries for continuous exposure to real language.', 'LISTENING', 'ENGLISH'),
    ('LanguageTool', 'https://languagetool.org/', 'Free text correction with grammar and style feedback across multiple languages.', 'EXTENSIONS', 'ENGLISH'),
    ('Clozemaster (Free Mode)', 'https://www.clozemaster.com/', 'Practice with real sentences by completing words in context.', 'COMPREHENSION', 'ENGLISH'),
    ('LyricsTranslate', 'https://lyricstranslate.com/', 'Collaborative song translations focused on understanding meaning in context.', 'READING', 'ENGLISH'),
    ('CBC Radio', 'https://www.cbc.ca/listen/live-radio', 'Canadian live radio with natural speech and real interviews.', 'LISTENING', 'ENGLISH'),
    ('Elllo Cloze Exercises', 'https://elllo.org/english/Mixer.htm', 'Fill-in-the-blank exercises based on real audio content.', 'COMPREHENSION', 'ENGLISH'),
    ('Daily Grammar', 'https://www.dailygrammar.com/', 'Short grammar lessons with practical exercises.', 'COMPREHENSION', 'ENGLISH'),
    ('Agenda Web English Exercises', 'https://agendaweb.org/', 'Large collection of interactive English exercises.', 'COMPREHENSION', 'ENGLISH'),
    ('EnglishPage Exercises', 'https://www.englishpage.com/', 'Detailed grammar exercises with immediate correction.', 'COMPREHENSION', 'ENGLISH'),
    ('Write & Improve', 'https://writeandimprove.com/', 'Writing practice with automated level-based feedback.', 'EXTENSIONS', 'ENGLISH'),
    ('France Inter Live', 'https://www.radiofrance.fr/franceinter', 'Live French radio with real-world language.', 'LISTENING', 'FRENCH'),
    ('BFM TV Live', 'https://www.bfmtv.com/en-direct/', 'Live French news channel.', 'LISTENING', 'FRENCH'),
    ('Texs French Grammar', 'https://www.laits.utexas.edu/tex/', 'Full French grammar exercises with feedback.', 'COMPREHENSION', 'FRENCH'),
    ('Conjuguemos French', 'https://conjuguemos.com/', 'Interactive conjugation practice for French learners.', 'COMPREHENSION', 'FRENCH'),
    ('ARD Live TV', 'https://www.ardmediathek.de/live', 'Live German TV with real native content.', 'LISTENING', 'GERMAN'),
    ('Deutschlandradio', 'https://www.deutschlandradio.de/', 'German radio with debates and authentic language.', 'LISTENING', 'GERMAN'),
    ('Deutsch Uebungen', 'https://deutsch-ueben.de/', 'Interactive German exercises focused on practice.', 'COMPREHENSION', 'GERMAN'),
    ('Schubert Verlag Exercises', 'https://www.schubert-verlag.de/aufgaben/index.htm', 'Structured German exercises organized by level.', 'COMPREHENSION', 'GERMAN'),
    ('RTVE Live', 'https://www.rtve.es/play/directo/', 'Live Spanish TV with real programs and news.', 'LISTENING', 'SPANISH'),
    ('123TeachMe', 'https://www.123teachme.com/', 'Interactive Spanish exercises with quizzes and vocabulary practice.', 'COMPREHENSION', 'SPANISH')
) AS v(name, url, description, category, language)
WHERE NOT EXISTS (
  SELECT 1
  FROM sources s
  WHERE s.name = v.name
    AND s.language = v.language
);
