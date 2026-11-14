# App Store listing: Torah Story Pals 1.0 (draft for Dan to check)

A first draft, written 2026-11-13. Nothing here has been entered in App Store Connect. Character counts are checked
against Apple's limits (name and subtitle 30, keywords 100, promotional text 170).

## Before any of this can be submitted

- [ ] Create the app record in App Store Connect for `com.dancruz.torahstorypals`.
- [ ] Publish the privacy and support pages. The app's own policy names
      `dan8nod.github.io/torah-story-pals/privacy.html`, and that address does not exist yet.
- [ ] Create the 15 in-app purchases (`npm run storekit -- --table` prints them with their three display names).
- [ ] Have a native Hebrew speaker read the Hebrew in the app and in this listing.
- [ ] Set `OPEN_FOR_TESTERS` to `false` in `js/config.js`. While it is `true`, every story is open and nothing is sold.

## App information

| Field | Value |
|---|---|
| Bundle ID | `com.dancruz.torahstorypals` |
| Version / build | 1.0.0 (1) |
| Primary category | Education |
| Secondary category | Games |
| Kids Category | **Ages 5 and Under** |
| Price | Free, with in-app purchases |
| Privacy Policy URL | https://dan8nod.github.io/torah-story-pals/privacy.html (not published yet) |
| Support URL | https://dan8nod.github.io/torah-story-pals/support.html (not published yet) |
| Copyright | 2026 Dan Cruz |

## App Privacy ("nutrition label")
- Data collection: **No, we do not collect data from this app.** That gives the label "Data Not Collected".
- Tracking: none. The privacy manifest (`ios/App/App/PrivacyInfo.xcprivacy`) agrees.

## Age rating questionnaire
Answer **None** to every content item. The stories are gentle: the lions sleep, the giant falls over, the sea opens.
- Unrestricted web access: No. User-generated content or chat: No. Gambling or contests: No.
- Made for Kids: Yes, Ages 5 and Under. Expected result: **4+**.

## Localizations

### English (U.S.): the primary language

- **Name** (28): `Torah Story Pals: Kids Torah`
- **Subtitle** (26): `Read-aloud Torah, ages 3–6`
- **Promotional text** (167): `Fifteen stories from the Torah, Prophets and Writings, read aloud in English, Spanish and Hebrew, each with a gentle mini-game. No ads. Works offline. For ages 3 to 6.`
- **Keywords** (96): `torah,jewish,kids,bible stories,preschool,hebrew,spanish,noah,moses,shabbat,purim,parsha,toddler`

**Description:**

> Torah Story Pals brings fifteen favorite stories from the Torah, the Prophets and the Writings to life for little ones, read aloud in English, Spanish or Hebrew. Turn on two languages and every page is read in both.
>
> Every page is narrated, so children don't need to read. Each story ends with a gentle mini-game that practices early-learning skills. Nobody can lose: a wrong tap just wiggles.
>
> TORAH TRAIL
> • Hashem Made the World: tap sparkles to find the sun, trees and animals, and rest on Shabbat
> • Noah's Big Boat: bring the animals in two by two
> • Abraham Counts the Stars: tap the stars from 1 to 5
> • Joseph's Colorful Coat: a memory match of red, blue and yellow coats
> • Baby Moses: steer the basket down the river
> • Crossing the Sea: help everyone walk across
> • Bread from Heaven: fill six baskets with manna
>
> KINGS AND PROPHETS
> • Samuel Hears a Voice, David the Brave, Elijah and the Ravens, Jonah and the Big Fish, Hashem Is My Shepherd (Psalm 23), Ruth and Naomi, Queen Esther, and Daniel and the Lions
>
> MADE FOR FAMILIES
> • English, Español and עברית, one or two at a time
> • Three voice-guided prayers a family says together, line by line
> • Counting, colors, numbers, memory, listening and new words
> • Gold stars to collect on two island maps
> • Works offline, even on a plane or in the car
> • A grown-ups area behind a parent gate, with the passage for each story and tips for talking together
>
> SAFE BY DESIGN
> No ads. No accounts. No tracking. Nothing your child does leaves the device. The first three stories and two prayers are free. A grown-up can unlock the rest, one story at a time or a whole world at once, after answering a question meant for grown-ups.

### Spanish (Mexico)

- **Name** (20): `Amiguitos de la Torá`
- **Subtitle** (27): `Historias de la Torá, 3 a 6`
- **Promotional text** (164): `Quince historias de la Torá, los Profetas y los Escritos, leídas en voz alta en español, inglés y hebreo, con un minijuego en cada una. Sin anuncios. De 3 a 6 años.`
- **Keywords** (92): `torá,judío,niños,historias bíblicas,preescolar,hebreo,inglés,noé,moisés,shabat,purim,parashá`

**Descripción:**

> Amiguitos de la Torá da vida a quince historias favoritas de la Torá, los Profetas y los Escritos para los más pequeños, leídas en voz alta en español, inglés o hebreo. Active dos idiomas y cada página se lee en ambos.
>
> Cada página se narra, así que los niños no necesitan saber leer. Cada historia termina con un minijuego tranquilo que practica habilidades tempranas. Nadie pierde: si tocan mal, solo se mueve un poquito.
>
> SENDERO DE LA TORÁ
> • Hashem Creó el Mundo, El Gran Barco de Noé, Abraham Cuenta las Estrellas, La Túnica de Colores de José, El Bebé Moisés, El Cruce del Mar y Pan del Cielo
>
> REYES Y PROFETAS
> • Samuel Escucha una Voz, David el Valiente, Elías y los Cuervos, Jonás y el Gran Pez, Hashem Es Mi Pastor (Salmo 23), Rut y Noemí, La Reina Ester y Daniel y los Leones
>
> HECHO PARA LAS FAMILIAS
> • Español, English y עברית, uno o dos a la vez
> • Tres oraciones guiadas que la familia dice junta, línea por línea
> • Contar, colores, números, memoria, escuchar y palabras nuevas
> • Estrellas de oro para coleccionar en dos mapas
> • Funciona sin internet, en el avión o en el carro
> • Un área para adultos con control parental, con el pasaje de cada historia y consejos para conversar juntos
>
> SEGURO DESDE EL PRINCIPIO
> Sin anuncios. Sin cuentas. Sin rastreo. Nada de lo que hace su hijo sale del dispositivo. Las primeras tres historias y dos oraciones son gratis. Un adulto puede desbloquear las demás, una por una o un mundo completo, después de responder una pregunta para adultos.

### Hebrew: needs a native speaker's read before it is used

- **Name** (19): `חברים לסיפורי התורה`
- **Subtitle** (24): `סיפורי תורה לגילי 3 עד 6`
- **Promotional text** (118): `חמישה עשר סיפורים מהתורה, מהנביאים ומהכתובים, מוקראים בעברית, באנגלית ובספרדית, עם משחקון עדין בכל סיפור. בלי פרסומות.`
- **Keywords** (81): `תורה,סיפורי התורה,ילדים,גן,פעוטות,עברית,אנגלית,ספרדית,נח,משה,שבת,פורים,פרשת השבוע`

## Screenshots
- Required sizes: **iPad 13"** (2064 × 2752, landscape 2752 × 2064) and **iPhone 6.9"** (1320 × 2868, landscape 2868 × 1320). The app is landscape only, so use landscape shots.
- `node tests/play-through.mjs --shots shots` saves every screen; add `--lang he` or `--lang en+he` for the other languages.
- Suggested order:
  1. The Torah Trail map
  2. Crossing the Sea, with an English + Hebrew caption
  3. Noah's ark game
  4. Joseph's coat memory match
  5. The Shabbat page from Creation
  6. The reward screen with stars

## App Review notes (paste into "Notes")
> Torah Story Pals is an offline story game for ages 3–6, in English, Spanish and Hebrew. There is no sign-in, no ads and no data collection. The only network use is the App Store, for prices and purchases. Grown-ups area: tap the padlock button at the top of the home screen, then press and hold "Hold" for 3 seconds. Purchases sit behind a times-table question written out in words. Narration uses recorded clips bundled with the app, plus the iOS text-to-speech voice for lines that have no recording yet.

Sign-in required: **No** (leave the demo account empty).
