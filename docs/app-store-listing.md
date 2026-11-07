# App Store listing: Bilingual Bible Story Pals 1.0 (draft for Dan to check)

Replaces the earlier draft, which described a free 1.0 with no in-app purchases. Version 1.0 now has **3 free stories, then 14 one-time purchases** ($1.00 a story, $2.00 a world).

Paste these into App Store Connect. This repo is public, so keep your reviewer phone number out of this file and enter it only in App Store Connect.

## Decide before submitting

| Decision | Why it matters | Suggested |
|---|---|---|
| **Made for Kids, ages 5 and under** | Apple locks this once the app is approved, and all later updates must follow the Kids rules. Apps outside the Kids Category can't describe children as the main audience, so this copy only works inside it. | Yes |
| **ElevenLabs plan** | Clips made on a free plan can't be used commercially, even if you upgrade later. Check which plan recorded the 66 clips in `audio/`. | Confirm it was a paid plan, or re-record them |
| **Family Sharing on the 14 purchases** | Apple doesn't let you turn it off again. It's currently off. | Your call |
| **Age rating answers** | They are your statement to Apple. See the two judgment calls below. | None, as listed |

## Before submitting

- **Submit build 5 or later, not build 4.** Build 4 lacks the Nov 1 fixes from `main`, and on its code the regression test fails with "memory game got stuck after fast taps". Build 5 has those fixes and shows the full privacy policy in the grown-ups area, as guideline 5.1.1(i) asks, with no link out of the app.
- **Publish the new pages first:** the live privacy page still says "No in-app purchases in version 1.0", and App Review will read it.

## App Information

| Field | Value |
|---|---|
| Name | `Bilingual Bible Story Pals` (record already created) |
| Bundle ID | `com.dancruz.biblestorypals` |
| Primary language | English (U.S.) |
| Primary category | Education |
| Secondary category | Games |
| Content rights | Yes, it contains third-party content and you have the rights (Baloo 2 font, ElevenLabs voices). Answer after checking the ElevenLabs plan. |
| Price | Free, with in-app purchases |
| Privacy Policy URL | https://dan8nod.github.io/bible-story-pals/privacy.html |
| Support URL | https://dan8nod.github.io/bible-story-pals/support.html |
| Marketing URL | Leave empty. The site is the free web version, which would send buyers around the purchases. |
| Copyright | `2026 Daniel Cruz` |

## App Privacy

- Data collection: **No, we do not collect data from this app.** The label reads "Data Not Collected".
- Tracking: none. `ios/App/App/PrivacyInfo.xcprivacy` agrees.
- Checked in the code: the game's only requests are for its own bundled files, and the purchase code uses only Apple's StoreKit.

## Age rating questionnaire

| Section | Answer |
|---|---|
| In-app controls: Parental Controls, Age Assurance | No (the gate protects purchases; parents don't configure anything) |
| Capabilities: Web Access, User-Generated Content, Social Media, Messaging and Chat, Advertising | No |
| Mature Themes: Profanity, Horror/Fear, Alcohol/Tobacco/Drugs | None |
| Medical or Wellness | None |
| Sexuality or Nudity, including Mature or Suggestive Themes | None |
| Violence: Cartoon or Fantasy, Realistic, Graphic, Guns or Other Weapons | None |
| Chance-Based: Gambling, Simulated Gambling, Contests, Loot Boxes | None / No (stars reward finishing a story; nothing is ranked) |
| Age Categories and Override | Made for Kids, Ages 5 and Under |

Expected rating: **4+**. If the form asks about Shared Location or Dating and Relationships (new from Nov 16, 2026), the answer is No.

**Two judgment calls to read yourself:**
- *David the Brave:* "Plop! The giant fell down." Goliath tips over with his eyes closed. The game has the child pick stones, but no sling or weapon is drawn.
- *The Good Samaritan:* "robbers hurt him." The robbers are never shown. The man lies on the road and is given a bandage.

Answering "Infrequent" for Cartoon or Fantasy Violence would make the app 9+. Apple's page doesn't say whether 9+ can still use the 5-and-under band.

## English (U.S.)

**Name** (26): `Bilingual Bible Story Pals`

**Subtitle** (28): `Stories in English & Spanish`

**Promotional text:**
```
Fifteen Bible stories read aloud in English, Spanish or both, each with a gentle mini-game at the end. The first 3 are free. No ads, no accounts. For ages 3 to 6.
```

**Keywords:**
```
kids,preschool,toddler,christian,jesus,noah,david,moses,sunday school,faith,kindergarten,read aloud
```

**Description:**
```
Bilingual Bible Story Pals brings fifteen favorite Bible stories to life for little ones, read aloud in English, Spanish, or both.

Every page is narrated, so children don't need to read. Each story ends with a gentle mini-game that practices early-learning skills. Nobody can lose: a wrong tap just wiggles.

STORY ISLAND
• God Made the World: tap sparkles to make the sun, trees and animals
• Noah's Big Boat: bring the animals in two by two
• Baby Moses: steer the basket down the river
• David the Brave: pick five smooth stones
• God Is My Shepherd (Psalm 23): tap the path home
• Jonah and the Big Fish: pop the colored bubbles
• Daniel and the Lions: put the lions to sleep
• Baby Jesus Is Born: light the stars 1 to 5
• Jesus Is Baptized: a memory match about the Father, the Son and the Holy Spirit
• Jesus Calms the Storm: tap the storm clouds away
• Jesus Feeds Everyone: gather 5 loaves and 2 fish
• The Lost Sheep: play hide-and-seek behind the bushes

FRIENDSHIP SEA
• The Big Catch: fill Peter's boat with fish
• The Good Samaritan: bring the hurt man what he needs
• Zacchaeus Climbs a Tree: find him in the leaves

MADE FOR FAMILIES
• English, Español, or EN + ES, which reads every page in both languages. Great for bilingual homes and dual-language classrooms.
• Counting, colors, numbers, memory and new words in two languages
• Gold stars to collect on the map
• Plays offline, even on a plane or in the car
• A grown-ups area with Bible references for each story and tips for talking together

THE FIRST 3 STORIES ARE FREE
God Made the World, Noah's Big Boat and Baby Moses are free. A grown-up can unlock any other story, or everything left in a world, with a one-time in-app purchase. There are no subscriptions. Purchases sit behind a question for grown-ups and can be restored at any time.

SAFE BY DESIGN
No ads. No accounts. No tracking. No data collected. Nothing your child does leaves the device.
```

## Spanish (Mexico): add as a second localization

Apple may refuse the name if another app already uses it. If so, try `Amiguitos de la Biblia: Niños`.

**Name** (22): `Amiguitos de la Biblia`

**Subtitle** (29): `Historias en español e inglés`

**Promotional text:**
```
Quince historias bíblicas leídas en voz alta en español, inglés o ambos, con un minijuego al final de cada una. Las primeras 3 son gratis. Sin anuncios. De 3 a 6 años.
```

**Keywords:**
```
niños,preescolar,cristiano,jesús,noé,moisés,david,escuela dominical,kínder,bilingüe,cuentos
```

**Descripción:**
```
Amiguitos de la Biblia da vida a quince historias bíblicas favoritas para los más pequeños, leídas en voz alta en español, en inglés o en los dos idiomas.

Cada página se narra, así que los niños no necesitan saber leer. Cada historia termina con un minijuego tranquilo que practica habilidades tempranas. Nadie pierde: si tocan mal, solo se mueve un poquito.

ISLA DE LAS HISTORIAS
• Dios Creó el Mundo: toca los destellos para crear el sol, los árboles y los animales
• El Gran Barco de Noé: sube a los animales de dos en dos
• El Bebé Moisés: guía la canasta por el río
• David el Valiente: escoge cinco piedras lisas
• Dios Es Mi Pastor (Salmo 23): toca el camino a casa
• Jonás y el Gran Pez: revienta las burbujas de colores
• Daniel y los Leones: haz dormir a los leones
• Nace el Niño Jesús: enciende las estrellas del 1 al 5
• El Bautismo de Jesús: un juego de memoria sobre el Padre, el Hijo y el Espíritu Santo
• Jesús Calma la Tormenta: toca las nubes de tormenta
• Jesús Alimenta a Todos: junta 5 panes y 2 peces
• La Oveja Perdida: juega a las escondidas detrás de los arbustos

MAR DE LA AMISTAD
• La Gran Pesca: llena de peces la barca de Pedro
• El Buen Samaritano: lleva al hombre herido lo que necesita
• Zaqueo Sube a un Árbol: encuéntralo entre las hojas

HECHO PARA LAS FAMILIAS
• Español, English o EN + ES, que lee cada página en los dos idiomas. Ideal para hogares bilingües y salones de doble idioma.
• Contar, colores, números, memoria y palabras nuevas en dos idiomas
• Estrellas de oro para coleccionar en el mapa
• Funciona sin internet, en el avión o en el carro
• Un área para adultos con las citas bíblicas de cada historia y consejos para conversar juntos

LAS PRIMERAS 3 HISTORIAS SON GRATIS
Dios Creó el Mundo, El Gran Barco de Noé y El Bebé Moisés son gratis. Un adulto puede desbloquear cualquier otra historia, o todas las que quedan en un mundo, con una sola compra dentro de la app. No hay suscripciones. Las compras están protegidas con una pregunta para adultos y se pueden restaurar en cualquier momento.

SEGURO DESDE EL PRINCIPIO
Sin anuncios. Sin cuentas. Sin rastreo. No se recopilan datos. Nada de lo que hace su hijo sale del dispositivo.
```

## Screenshots

The images aren't in this repo. They're in the `screenshots/` folder next to this checkout, by language and device. No prices appear in them, as guideline 2.3.7 asks.

| Upload to | Size | Folder |
|---|---|---|
| iPad 13" | 2752 × 2064 | `screenshots/en/ipad-13`, `screenshots/es/ipad-13` |
| iPhone 6.9" (Apple scales it for smaller iPhones) | 2868 × 1320 | `screenshots/en/iphone-6.9`, `screenshots/es/iphone-6.9` |

Order: story map, both-languages page, Noah's game, Moses's game, memory match, reward, Friendship Sea.

## App Review

Sign-in required: **uncheck it**. The app has no accounts.

Contact: enter your name, phone and email in App Store Connect only.

**Notes (paste):**
```
Bilingual Bible Story Pals is a Bible story game for ages 3 to 6, in English and Spanish. There are no accounts, ads, analytics or data collection, and no sign-in is needed.

FREE STORIES
God Made the World, Noah's Big Boat and Baby Moses open right away from the Story Island map.

IN-APP PURCHASES (all non-consumable)
1. Tap any stop with a padlock, for example David the Brave.
2. "Time to ask a grown-up!" offers that story or every story left in that world.
3. Choosing one opens the parental gate: a multiplication question written in words, such as "What is seven times four?", answered on a keypad. A wrong answer does not continue.
4. The App Store sheet then appears, and the story opens after the purchase.

Friendship Sea is the second world, on the tab above the map. "Restore purchases" is on the "Time to ask a grown-up!" screen and in the grown-ups area.

GROWN-UPS AREA
Tap "For grown-ups", then press and hold "Hold" for 3 seconds. It has the language setting (English, Español, EN + ES), narration and sound settings, purchases, the privacy policy, tips, and the Bible reference for each story. Any purchase made here goes through the same multiplication gate.

NARRATION
God Made the World and common phrases are recorded clips bundled with the app. All other lines use the iOS text-to-speech voice.

NETWORK
All game content is bundled and plays offline. The app's only network use is StoreKit, for prices, purchases and restoring.

CONTENT
In Jesus Is Baptized, God the Father appears only as light and a voice, never as a person.
```

## In-app purchases

All 14 exist in App Store Connect with English and Spanish (Mexico) names, 175 regions and a review screenshot. Add all of them to this version's submission, since a first purchase can only be reviewed with an app version.
