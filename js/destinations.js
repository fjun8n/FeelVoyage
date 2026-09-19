/* FeelVoyage — lista destinațiilor și pachetelor */
const destinations = [
    // ROMANIAN DESTINATIONS
    {
        id: 'delta-dunarii',
        title: 'Delta Dunării - Sanctuarul Naturii',
        category: 'romania',
        tagLabel: 'România • Natură',
        price: 340,
        priceRon: '1.700 lei',
        rating: 4.9,
        currency: '€',
        period: '4 Nopți / Pensiune Completă',
        images: [
            'https://images.unsplash.com/photo-1674840967352-eaa8e8e78579?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1627841758564-04da22e49a55?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1628672930840-839293b5aa6e?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1726651470057-b06bb2d93bae?auto=format&fit=crop&w=1000&q=80'
        ],
        description: 'Plimbări cu barca prin canale meandrate, colonii de pelicani, nuferi albi și gastronomie tradițională din pește în Sfântu Gheorghe și Sulina. Cazare în resort plutitor de 4 stele cu mic dejun și prânz pescăresc.',
        amenities: ['Excursii cu Barca', 'Resort 4★', 'Pensiune Completă', 'Degustare Stornose', 'Ghid Local']
    },
    {
        id: 'poiana-brasov',
        title: 'Poiana Brașov - Răsfăț Alpin',
        category: 'romania',
        tagLabel: 'România • Munte',
        price: 280,
        priceRon: '1.400 lei',
        rating: 4.8,
        currency: '€',
        period: '3 Nopți / Spa & Demipensiune',
        images: [
            'https://images.unsplash.com/photo-1778938318847-f72b5020ecd4?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1579091266804-d32541902871?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1788531495677-505acc91746a?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1659473595060-047a6eabae21?auto=format&fit=crop&w=1000&q=80'
        ],
        description: 'Relaxare la poalele Masivului Postăvarul! Te bucuri de aer curat de munte, trasee montane fascinante, acces nelimitat la centrul Spa de lux și traseu cu telegondola spre Vârful Postăvarul.',
        amenities: ['Acces Spa & Saună', 'Hotel 4★ Spa', 'Demipensiune', 'Bilet Telegondolă', 'Parcare Gratuită']
    },
    {
        id: 'bran-brasov',
        title: 'Castelul Bran & Brașovul Medieval',
        category: 'romania',
        tagLabel: 'România • Cultură',
        price: 220,
        priceRon: '1.100 lei',
        rating: 4.9,
        currency: '€',
        period: '3 Nopți / Mic Dejun',
        images: [
            'https://images.unsplash.com/photo-1781949899617-302cbc93f8c4?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1778595066773-44db20c0ec85?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1566376716959-4588429499be?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1662553423182-7ab65b441fa0?auto=format&fit=crop&w=1000&q=80'
        ],
        description: 'Descoperă legenda Castelului Bran, Biserica Neagră din Piața Sfatului din Brașov și atmosfera fermecătoare a străduțelor medievale. Pachetul include acces ghidat și cină boierească.',
        amenities: ['Tur Castel Bran', 'Boutique Hotel 4★', 'Cină Tradițională', 'Tur Ghidat Brașov']
    },
    {
        id: 'transfagarasan',
        title: 'Transfăgărășan & Lacul Bâlea',
        category: 'romania',
        tagLabel: 'România • Aventură',
        price: 250,
        priceRon: '1.250 lei',
        rating: 4.9,
        currency: '€',
        period: '3 Nopți / Demipensiune',
        images: [
            'https://images.unsplash.com/photo-1517476417305-21d49f984355?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1661288246731-a214a17bcf51?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1569165002757-3a13f7c2d7da?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1569165003085-e8a1066f1cb8?auto=format&fit=crop&w=1000&q=80'
        ],
        description: 'Cel mai spectaculos drum montan din lume! Parcurge serpentinele uimitoare ale Munților Făgăraș, vizitează Lacul glaciar Bâlea și Cascada Bâlea cu opțiuni de drumeție ghidată.',
        amenities: ['Hotel la Bâlea Lac', 'Demipensiune', 'Ghid Alpin', 'Tur Panoramic Auto']
    },
    {
        id: 'cazanele-dunarii',
        title: 'Cazanele Dunării & Statuia lui Decebal',
        category: 'romania',
        tagLabel: 'România • Plimbări',
        price: 260,
        priceRon: '1.300 lei',
        rating: 4.8,
        currency: '€',
        period: '3 Nopți / Demipensiune',
        images: [
            'https://images.unsplash.com/photo-1660895870628-f5246115aefc?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1787855746437-1b7b75023a54?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1768470898559-87485bffecdf?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1660895870461-a836aa1a1148?auto=format&fit=crop&w=1000&q=80'
        ],
        description: 'Croazieră spectaculoasă pe Dunăre la Cazanele Mari și Mici. Admirați sculptura monumentală a lui Decebal, Tabula Traiana și Peștera Ponicova în Clisura Dunării.',
        amenities: ['Croazieră Șalupă', 'Pensiune 4★ cu Piscină', 'Demipensiune', 'Ghid Local']
    },
    {
        id: 'maramures',
        title: 'Maramureș - Tradiție & Biserici de Lemn',
        category: 'romania',
        tagLabel: 'România • Tradiție',
        price: 310,
        priceRon: '1.550 lei',
        rating: 4.9,
        currency: '€',
        period: '5 Nopți / Pensiune Completă',
        images: [
            'https://images.unsplash.com/photo-1572533658203-4635d5c873d0?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1727409493440-e6d05a2b10e9?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1727409491844-c26953a8489d?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1727409491914-6cb4e7d48dcf?auto=format&fit=crop&w=1000&q=80'
        ],
        description: 'Simte spiritul autentic maramureșean! Plimbare cu Mocănița pe Valea Vaserului, vizită la Cimitirul Vesel din Săpânța și bisericile din lemn din patrimoniul UNESCO.',
        amenities: ['Bilet Mocănița', 'Pensiune Tradițională', 'Pensiune Completă', 'Degustare Horincă']
    },
    {
        id: 'sibiu-sighisoara',
        title: 'Sibiu & Sighișoara - Inima Transilvaniei',
        category: 'romania',
        tagLabel: 'România • Istoric',
        price: 240,
        priceRon: '1.200 lei',
        rating: 4.8,
        currency: '€',
        period: '3 Nopți / Mic Dejun',
        images: [
            'https://images.unsplash.com/photo-1456491882918-2bc1929963f6?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1661023942401-4068bce4d804?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1590427859061-ff050caf1082?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1788098350245-24fd31489026?auto=format&fit=crop&w=1000&q=80'
        ],
        description: 'Podul Minciunilor din Sibiu și Cetatea medievală locuită Sighișoara. O incursiune fascinantă în arhitectura săsească și bucătăria transilvăneană.',
        amenities: ['Hotel 4★ Central', 'Mic Dejun', 'Tur Pietonal Ghidat', 'Degustare Vin']
    },
    {
        id: 'mamaia-constanta',
        title: 'Mamaia & Litoralul Românesc',
        category: 'romania',
        tagLabel: 'România • Plajă',
        extraCategories: ['plaja'],
        price: 390,
        priceRon: '1.950 lei',
        rating: 4.7,
        currency: '€',
        period: '5 Nopți / All Inclusive',
        images: [
            'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/96/Beach_in_Mamaia_%28AP4P0892_1PS%29_%2829514916511%29.jpg/1280px-Beach_in_Mamaia_%28AP4P0892_1PS%29_%2829514916511%29.jpg',
            'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/Black_Sea_beach_in_Mamaia_%286117712232%29.jpg/1280px-Black_Sea_beach_in_Mamaia_%286117712232%29.jpg',
            'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5b/Mamaia_Beach_%28September_2013%29.JPG/1280px-Mamaia_Beach_%28September_2013%29.JPG'
        ],
        description: 'Sejur pe litoral la Marea Neagră cu plaje distinse cu Blue Flag, resorturi moderne în Mamaia Nord și vizită la Cazinoul din Constanța și Portul Tomis.',
        amenities: ['Resort 4★ pe Plajă', 'All Inclusive', 'Șezlonguri Incluse', 'Acces Aquapark']
    },

    // INTERNATIONAL DESTINATIONS (EUROPE & CITY BREAK)
    {
        id: 'roma',
        title: 'Roma - Orașul Etern, Italia',
        category: 'city-break',
        tagLabel: 'City Break • Cultură',
        price: 420,
        priceRon: '2.100 lei',
        rating: 4.9,
        currency: '€',
        period: '4 Nopți / Mic Dejun',
        images: [
            'https://images.unsplash.com/photo-1663143050642-69240b347b2b?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1509024644558-2f56ce76c490?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1634196243663-71cc3a1c639a?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?auto=format&fit=crop&w=1000&q=80'
        ],
        description: 'Pășește în istorie! Colosseumul, Fontana di Trevi, Forumul Roman și Vaticanul te așteaptă cu înghețată gelato autentică și mâncăruri italienești desăvârșite.',
        amenities: ['Zbor Inclus', 'Hotel 4★ Central', 'Mic Dejun', 'Bilet Colosseum Fast-Track']
    },
    {
        id: 'barcelona',
        title: 'Barcelona - Sagrada Familia & Mare',
        category: 'city-break',
        tagLabel: 'City Break • Plajă',
        price: 490,
        priceRon: '2.450 lei',
        rating: 4.9,
        currency: '€',
        period: '4 Nopți / Mic Dejun',
        images: [
            'https://images.unsplash.com/photo-1656597787628-62741d181641?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1567437890326-0084ea9d99e9?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1770323169830-703c8c80a758?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1728249960363-13079cc2c6f6?auto=format&fit=crop&w=1000&q=80'
        ],
        description: 'Capodoperele lui Gaudi, Parcul Güell, bulevardul La Rambla și plajele vibrante din Barceloneta. O combinație spectaculoasă de cultură și atmosferă mediteraneană.',
        amenities: ['Zbor Direct', 'Hotel 4★ Lângă Plajă', 'Mic Dejun', 'Intrare Sagrada']
    },
    {
        id: 'londra',
        title: 'Londra - Metropola Regală',
        category: 'city-break',
        tagLabel: 'City Break • Shopping',
        price: 520,
        priceRon: '2.600 lei',
        rating: 4.8,
        currency: '€',
        period: '4 Nopți / Mic Dejun',
        images: [
            'https://images.unsplash.com/photo-1599676603816-0f92b2d713d2?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1520967824495-b529aeba26df?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1454537468202-b7ff71d51c2e?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1529180184525-78f99adb8e98?auto=format&fit=crop&w=1000&q=80'
        ],
        description: 'Big Ben, London Eye, Palatul Buckingham și atmosfera cosmopolită din Covent Garden. Include tur cu autobuzul supraetajat și acces la muzeele britanice de top.',
        amenities: ['Zbor Inclus', 'Hotel 4★ Central', 'Pass London Eye', 'Mic Dejun']
    },
    {
        id: 'praga',
        title: 'Praga - Orașul celor 100 de Turnuri',
        category: 'city-break',
        tagLabel: 'City Break • Romantic',
        price: 380,
        priceRon: '1.900 lei',
        rating: 4.8,
        currency: '€',
        period: '3 Nopți / Mic Dejun',
        images: [
            'https://images.unsplash.com/photo-1581525046703-e553ee7b3de9?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1666538689358-218bdc4dd911?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1666687067593-a5a89fd99edd?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1672875752597-a59fed56a262?auto=format&fit=crop&w=1000&q=80'
        ],
        description: 'Podul Carol la răsărit, Ceasul Astronomic din Piața Orașului Vechi și Castelul Praga. Croazieră relaxantă pe râul Vltava cu cină romantică inclusă.',
        amenities: ['Zbor Direct', 'Hotel 4★ Central', 'Croazieră pe Vltava', 'Mic Dejun']
    },
    {
        id: 'viena',
        title: 'Viena - Eleganta Palatelor Imperiale',
        category: 'city-break',
        tagLabel: 'City Break • Eleganță',
        price: 410,
        priceRon: '2.050 lei',
        rating: 4.9,
        currency: '€',
        period: '3 Nopți / Mic Dejun',
        images: [
            'https://images.unsplash.com/photo-1615232867241-ebf770bc68b5?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1662119431157-40e08341aff5?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1665519392482-9b176c1a341e?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1622540633251-f2fbb6646969?auto=format&fit=crop&w=1000&q=80'
        ],
        description: 'Palatul Schönbrunn, Operele vieneze și faimoasa prăjitură Sachertorte. O experiență de clasă regală în inima Europei Centrale.',
        amenities: ['Zbor Inclus', 'Hotel 4★ Superior', 'Intrare Schönbrunn', 'Mic Dejun']
    },
    {
        id: 'paris',
        title: 'Paris - Orașul Luminilor & Turnul Eiffel',
        category: 'city-break',
        tagLabel: 'City Break • Romantism',
        price: 450,
        priceRon: '2.250 lei',
        rating: 4.9,
        currency: '€',
        period: '3 Nopți / Mic Dejun',
        images: [
            'https://images.unsplash.com/photo-1609971757431-439cf7b4141b?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1565881606991-789a8dff9dbb?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1569949380643-6e746ecaa3bd?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1524396309943-e03f5249f002?auto=format&fit=crop&w=1000&q=80'
        ],
        description: 'Descoperă romantismul Parisului, Turnul Eiffel, Muzeul Luvru și restaurantele franțuzești cochete. Include bilet de avion direct și cazare în hotel boutique 4 stele.',
        amenities: ['Zbor Direct', 'Hotel 4★ Central', 'Mic Dejun', 'Tur Ghidat privat']
    },

    // EXOTIC & BEACH DESTINATIONS
    {
        id: 'maldive-deluxe',
        title: 'Maldive - Water Villa Deluxe Resort',
        category: 'exotic',
        tagLabel: 'Exotic • Lux',
        price: 1650,
        priceRon: '8.250 lei',
        rating: 5.0,
        currency: '€',
        period: '7 Nopți / Premium All Inclusive',
        images: [
            'https://images.unsplash.com/photo-1688949078626-a358f500e063?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1614505241550-0777412c47ec?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1683650904081-78afc08950cb?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1564469780933-37609ec45780?auto=format&fit=crop&w=1000&q=80'
        ],
        description: 'Vile exclusiviste construite direct pe apele de turcoaz ale oceanului. Snorkeling cu pisici de mare, cine romantic pe plajă și tratamente Spa de clasă mondială.',
        amenities: ['Zbor Inclus', 'Vila pe Apă 5★', 'Premium All Inclusive', 'Transfer Hidroavion']
    },
    {
        id: 'kenya-safari',
        title: 'Kenya - Safari în Masai Mara & Plajă',
        category: 'exotic',
        tagLabel: 'Exotic • Aventură',
        price: 1790,
        priceRon: '8.950 lei',
        rating: 4.9,
        currency: '€',
        period: '8 Nopți / Circuit & Resort',
        images: [
            'https://images.unsplash.com/photo-1639221328493-f00c07470c44?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1720449200587-af15f6c20cba?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1535759554012-8cbbc491f0b7?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1780599186773-c76e4c314c16?auto=format&fit=crop&w=1000&q=80'
        ],
        description: 'Aventură safari de neuitat pentru a vedea leii, elefanții și girafele în rezervația Masai Mara, urmată de relaxare pe plajele exotice cu nisip alb din Diani Beach.',
        amenities: ['Zbor Inclus', 'Lodge Safari 5★', 'Game Drives 4x4', 'Full Board']
    },
    {
        id: 'bali',
        title: 'Bali - Ubud & Plaja Seminyak',
        category: 'exotic',
        tagLabel: 'Exotic • Relaxare',
        price: 1150,
        priceRon: '5.750 lei',
        rating: 4.9,
        currency: '€',
        period: '10 Nopți / Demipensiune',
        images: [
            'https://images.unsplash.com/photo-1654703942329-01d6a0a3ed62?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1559628233-eb1b1a45564b?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1682406187130-84561b4e0e78?auto=format&fit=crop&w=1000&q=80'
        ],
        description: 'Combinație magică între templele istorice și terasele de orez din Ubud cu relaxare la vile de lux cu piscină privată pe plajele exotice din Seminyak.',
        amenities: ['Zbor Inclus', 'Vile cu Piscină 5★', 'Excursii Temple', 'Massage Spa Inclus']
    },
    {
        id: 'santorini',
        title: 'Santorini - Apusuri de Vis, Grecia',
        category: 'plaja',
        tagLabel: 'Plajă • Romantism',
        price: 680,
        priceRon: '3.400 lei',
        rating: 4.8,
        currency: '€',
        period: '5 Nopți / Mic Dejun',
        images: [
            'https://images.unsplash.com/photo-1618478669118-1b3eb2b2bb95?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1604503245604-930a6f3513ef?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1504823956878-c6b5df020d49?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1535919020263-f79f5313f336?auto=format&fit=crop&w=1000&q=80'
        ],
        description: 'Căsuțe albe cu cupole albastre suspendate deasupra Mării Egee. Cazare în Oia cu vedere directă spre faimosul apus din Santorini și croazieră pe catamaran.',
        amenities: ['Zbor Direct', 'Boutique Hotel 4★', 'Croazieră Catamaran', 'Mic Dejun']
    },
    {
        id: 'tokyo',
        title: 'Tokyo & Kyoto - Circuit Japonia',
        category: 'exotic',
        tagLabel: 'Exotic • Cultură',
        price: 1890,
        priceRon: '9.450 lei',
        rating: 5.0,
        currency: '€',
        period: '9 Nopți / Circuit Ghidat',
        images: [
            'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1574236170880-fbbca132d83d?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1582603455714-a46aaf41e5d9?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1503640538573-148065ba4904?auto=format&fit=crop&w=1000&q=80'
        ],
        description: 'Contraste fascinante între zgârie-nori ultra-moderni și temple tradiționale shinto. Circuit complet cu trenul glonț Shinkansen și ghid vorbitor de română.',
        amenities: ['Zbor Inclus', 'JR Pass Tren Glonț', 'Hoteluri 4★', 'Ghid Română']
    },
    {
        id: 'alpi-elvetia',
        title: 'Alpii Elvețieni & Matterhorn',
        category: 'munte',
        tagLabel: 'Munte • Peisaje',
        price: 1250,
        priceRon: '6.250 lei',
        rating: 4.9,
        currency: '€',
        period: '6 Nopți / Demipensiune',
        images: [
            'https://images.unsplash.com/photo-1571274834067-3a24675547b4?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1617395547071-98efcee72011?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1535224206242-487f7090b5bb?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1517490560101-4ffe479ef5c3?auto=format&fit=crop&w=1000&q=80'
        ],
        description: 'Peisaje montane alpine spectaculoase, plimbări cu trenul iconic Glacier Express și aer proaspăt în Zermatt lângă Muntele Matterhorn.',
        amenities: ['Zbor & Tren Inclus', 'Resort Montan 4★', 'Pass Glacier Express', 'Spa Alpin']
    },
    {
        id: 'dubai',
        title: 'Dubai - Zgârie Nori & Safari',
        category: 'city-break',
        tagLabel: 'City Break • Lux',
        price: 790,
        priceRon: '3.950 lei',
        rating: 4.8,
        currency: '€',
        period: '5 Nopți / Demipensiune',
        images: [
            'https://images.unsplash.com/photo-1634007626524-f47fa37810a7?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1608991156162-3c55b3cf05d3?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1652707228067-25672fa0b082?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1607414851776-f2fcc379fb48?auto=format&fit=crop&w=1000&q=80'
        ],
        description: 'Burj Khalifa, safari cu jeep-ul 4x4 pe dunele aurii de nisip, spectacole de fontane și plaje ultramoderne în Jumeirah.',
        amenities: ['Zbor Direct', 'Hotel 5★', 'Safari Deșert', 'Bilet Burj Khalifa']
    },
    {
        id: 'cappadocia',
        title: 'Cappadocia - Baloane cu Aer Cald',
        category: 'exotic',
        tagLabel: 'Exotic • Aventură',
        price: 640,
        priceRon: '3.200 lei',
        rating: 4.9,
        currency: '€',
        period: '4 Nopți / Mic Dejun',
        images: [
            'https://images.unsplash.com/photo-1569530593440-e48dc137f7d0?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1604156787928-a5e83b3544f2?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1699519324068-8cade0601b53?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1695415683093-ae5f213ea898?auto=format&fit=crop&w=1000&q=80'
        ],
        description: 'Răsărituri fabuloase presărate cu sute de baloane colorate, hoteluri sculptate în stâncă rupestră și văi selenare uimitoare în Turcia.',
        amenities: ['Zbor Inclus', 'Hotel Săpat în Piatra', 'Zbor Balon Opțional', 'Tur Văi']
    },
    {
        id: 'newyork',
        title: 'New York - Metropola Visurilor',
        category: 'city-break',
        tagLabel: 'City Break • Shopping',
        price: 1350,
        priceRon: '6.750 lei',
        rating: 4.9,
        currency: '€',
        period: '6 Nopți / Cazare',
        images: [
            'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1659354408961-d2aaf77f5da9?auto=format&fit=crop&w=1000&q=80'
        ],
        description: 'Times Square, Central Park, Statuia Libertății și spectacole pe Broadway. Inima lumii moderne te așteaptă cu o atmosferă memorabilă.',
        amenities: ['Zbor Inclus', 'Hotel Manhattan 4★', 'CityPass Inclus', 'Asistență Turistică']
    },

    // ASIA DESTINATIONS (CHINA & SOUTH KOREA)
    {
        id: 'beijing-marele-zid',
        title: 'Beijing & Marele Zid al Chinei',
        category: 'asia',
        extraCategories: ['city-break'],
        tagLabel: 'China • Cultură & Istorie',
        price: 1180,
        priceRon: '5.900 lei',
        rating: 4.9,
        currency: '€',
        period: '7 Nopți / Tur Ghidat',
        images: [
            'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ad/66954-The-Great-Wall%2C_Mutianyu.jpg/1280px-66954-The-Great-Wall%2C_Mutianyu.jpg',
            'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ef/The_Forbidden_City_-_View_from_Coal_Hill.jpg/1280px-The_Forbidden_City_-_View_from_Coal_Hill.jpg',
            'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/The_Great_Wall_at_Mutianyu.jpg/1280px-The_Great_Wall_at_Mutianyu.jpg',
            'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/da/Beijing_China_Forbidden-City-03.jpg/1280px-Beijing_China_Forbidden-City-03.jpg'
        ],
        description: 'Marele Zid la Mutianyu, Orașul Interzis, Piața Tiananmen și Templele Cerului. Tur ghidat în limba română cu seară de operă tradițională Peking Opera și cena Peking Duck.',
        amenities: ['Zbor Inclus', 'Tur Ghidat RO', 'Hotel 4★ Central', 'Marele Zid & Orașul Interzis', 'Cină Peking Duck']
    },
    {
        id: 'shanghai-metropola-futurului',
        title: 'Shanghai - Metropola Viitorului',
        category: 'asia',
        extraCategories: ['city-break'],
        tagLabel: 'China • City Break',
        price: 990,
        priceRon: '4.950 lei',
        rating: 4.8,
        currency: '€',
        period: '5 Nopți / Mic Dejun',
        images: [
            'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/46/Pudong_skyline_at_dusk.jpg/1280px-Pudong_skyline_at_dusk.jpg',
            'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/40/A_night_at_the_Bund_-_Shanghai.jpg/1280px-A_night_at_the_Bund_-_Shanghai.jpg',
            'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/72/Shanghai_-_Yu_Garden_-_0034.jpg/1280px-Shanghai_-_Yu_Garden_-_0034.jpg',
            'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6c/The_Bund_by_night_20250503-3.jpg/1280px-The_Bund_by_night_20250503-3.jpg'
        ],
        description: 'Skyline-ul futurist Pudong, plimbarea pe Bund pe malul Huangpu, Grădina Yu și fostul cartier francez. Croazieră de seară cu vedere la metropola iluminată.',
        amenities: ['Zbor Inclus', 'Hotel 4★ Pudong', 'Croazieră pe Huangpu', 'Grădina Yu', 'Tur Panoramic']
    },
    {
        id: 'zhangjiajie-avatar',
        title: 'Zhangjiajie - Munții din Avatar',
        category: 'asia',
        extraCategories: ['munte'],
        tagLabel: 'China • Natură & Aventură',
        price: 1290,
        priceRon: '6.450 lei',
        rating: 4.9,
        currency: '€',
        period: '6 Nopți / Pensiune Completă',
        images: [
            'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/42/Avatar_World_37741-Zhangjiajie_%2849046811008%29.jpg/1280px-Avatar_World_37741-Zhangjiajie_%2849046811008%29.jpg',
            'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7c/Avatar_World_38058-Zhangjiajie_%2849046813673%29.jpg/1280px-Avatar_World_38058-Zhangjiajie_%2849046813673%29.jpg',
            'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ac/Avatar_World_38118-Zhangjiajie_%2849047318556%29.jpg/1280px-Avatar_World_38118-Zhangjiajie_%2849047318556%29.jpg',
            'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/Avatar_World_38101-Zhangjiajie_%2849047530837%29.jpg/1280px-Avatar_World_38101-Zhangjiajie_%2849047530837%29.jpg'
        ],
        description: 'Coloanele de quartzit care au inspirat munții din filmul Avatar, Podul de Sticlă Zhangjiajie (cel mai lung din lume) și ascensorul Bailong din peretele muntelui. Aventură de neuitat în Parcul Național Forestier.',
        amenities: ['Zbor Inclus', 'Parc Național UNESCO', 'Podul de Sticlă', 'Ascensorul Bailong', 'Ghid Montan']
    },
    {
        id: 'seoul-coreea',
        title: 'Seoul - Inima Coreei de Sud',
        category: 'asia',
        extraCategories: ['city-break'],
        tagLabel: 'Coreea de Sud • City Break',
        price: 1090,
        priceRon: '5.450 lei',
        rating: 4.9,
        currency: '€',
        period: '6 Nopți / Mic Dejun',
        images: [
            'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/41/Bukchon-ro_11-gil_street_with_hanok_houses_at_blue_hour_in_Bukchon_Hanok_Village_Seoul.jpg/1280px-Bukchon-ro_11-gil_street_with_hanok_houses_at_blue_hour_in_Bukchon_Hanok_Village_Seoul.jpg',
            'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ab/Water_reflection_of_Hyangwonjeong_Pavilion_at_Gyeongbokgung_Palace_in_Seoul.jpg/1280px-Water_reflection_of_Hyangwonjeong_Pavilion_at_Gyeongbokgung_Palace_in_Seoul.jpg',
            'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/40/Seoul_street_food_2011_march_02.jpg/1280px-Seoul_street_food_2011_march_02.jpg',
            'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6a/N_Seoul_Tower_view_1.jpg/1280px-N_Seoul_Tower_view_1.jpg'
        ],
        description: 'Palatul Gyeongbokgung cu ceremonia schimbului de gardă, satul hanok Bukchon, N Seoul Tower, cartierele Gangnam și Myeongdong plus tur gastronomic street food în piețele de noapte.',
        amenities: ['Zbor Inclus', 'Hotel 4★ Myeongdong', 'Tur Palat & Hanok', 'Tur Street Food', 'Card Transport T-Money']
    },
    {
        id: 'busan-coreea',
        title: 'Busan - Orașul Marina al Coreei',
        category: 'asia',
        extraCategories: ['plaja'],
        tagLabel: 'Coreea de Sud • Plajă & City',
        price: 1150,
        priceRon: '5.750 lei',
        rating: 4.8,
        currency: '€',
        period: '6 Nopți / Mic Dejun',
        images: [
            'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fd/Gwangan_Bridge%2C_Busan%2C_lighted_up_in_purple_for_BTS%2C_June_2019.jpg/1280px-Gwangan_Bridge%2C_Busan%2C_lighted_up_in_purple_for_BTS%2C_June_2019.jpg',
            'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/Haeundae_Beach_in_Busan.jpg/1280px-Haeundae_Beach_in_Busan.jpg',
            'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f8/Korea-Busan-Gwangan_Bridge-02.jpg/1280px-Korea-Busan-Gwangan_Bridge-02.jpg',
            'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/Pojangmacha_in_Haeundae%2C_Busan_%28917%29.jpg/1280px-Pojangmacha_in_Haeundae%2C_Busan_%28917%29.jpg'
        ],
        description: 'Podul Gwangan iluminat în nopți spectaculoase, plaja Haeundae, templul Haedong Yonggungsa pe stânci deasupra mării și corturile pojangmacha cu delicii coreene street food.',
        amenities: ['Zbor Inclus', 'Hotel 4★ Haeundae', 'Templul de pe Mare', 'Piața Peștelui Jagalchi', 'Vedere Gwangan']
    },
    {
        id: 'jeju-insula-vulcanica',
        title: 'Jeju - Insula Vulcanică a Coreei',
        category: 'asia',
        extraCategories: ['plaja'],
        tagLabel: 'Coreea de Sud • Plajă & Natură',
        price: 1350,
        priceRon: '6.750 lei',
        rating: 4.9,
        currency: '€',
        period: '7 Nopți / All Inclusive',
        images: [
            'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/19/Hydrangea_macrophylla_in_front_of_Seongsan_Ilchulbong_volcano_at_blue_hour_in_Jeju_Island_South_Korea.jpg/1280px-Hydrangea_macrophylla_in_front_of_Seongsan_Ilchulbong_volcano_at_blue_hour_in_Jeju_Island_South_Korea.jpg',
            'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0e/Hamdeok_Beach.jpg/1280px-Hamdeok_Beach.jpg',
            'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/61/Seongsan_Ilchulbong_from_the_air.jpg/1280px-Seongsan_Ilchulbong_from_the_air.jpg',
            'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f8/Seongsan%2C_Jeju_Island.jpg/1280px-Seongsan%2C_Jeju_Island.jpg'
        ],
        description: 'Vulcanul Seongsan Ilchulbong, plaje cu apă turcoaz ca Hamdeok, tunelul de lavă Manjanggul și faimoasele femei scufundătoare haenyeo. Paradise-ul Coreei de Sud, patrimoniu UNESCO.',
        amenities: ['Zbor Inclus', 'Resort 5★ pe Plajă', 'All Inclusive', 'Tur Vulkan UNESCO', 'Rental Auto Incluse']
    }
];
