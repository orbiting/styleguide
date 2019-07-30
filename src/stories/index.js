import React from 'react'

import { storiesOf } from '@storybook/react'

import Chart from '../components/Chart/Csv'
import Center from '../components/Center'
import { P } from '../components/Typography/Editorial'

storiesOf('Button', module).add('with text', () => (
  <Center>
    <P>
      Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
      commodo ligula eget dolor. Aenean massa. Cum sociis natoque
      penatibus et magnis dis parturient montes, nascetur ridiculus
      mus. Donec quam felis, ultricies nec, pellentesque eu, pretium
      quis, sem. Nulla consequat massa quis enim. Donec pede justo,
      fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo,
      rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum
      felis eu pede mollis pretium. Integer tincidunt. Cras dapibus.
      Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.
      Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac,
      enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a,
      tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque
      rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue.
    </P>
    <Chart
      config={{
        type: 'GenericMap',
        heightRatio: 0.8,
        points: true,
        pointLabel: 'Adresse',
        pointAttributes: ['Datum', 'Eigentümer'],
        sizeRangeMax: 2000,
        // color: 'category',
        colorLegend: false,
        // legendTitle: 'Anzahl Kündigungen',
        unit: 'Kündigungen',
        features: {
          url:
            'https://cdn.repub.ch/s3/republik-assets/assets/geo/basel-wohnviertel-selected-simplified.json',
          object: 'basel-wohnviertel-selected-fixed',
        },
      }}
      values={`
      lat,lon,Adresse,Eigentümer,Datum,value,category
      47.5518668,7.5888133,Steinentorstrasse 26,Steinentor AG,31.05.2018,8,1–20
      47.540383,7.600155,Delsbergerallee 41,QRE I GmbH,31.01.2018,8,1–20
      47.543298,7.593577,Güterstrasse 199–205,Fundamenta Real Estate AG,30.09.2019,30,21–40
      47.5479324,7.6110457,Karl Jaspers-Allee ,Christoph Merian Stiftung,28.02.2019,60,41–60
      47.545378,7.591963,Hochstrasse 4-12,Anlagestiftung Turidomus,30.09.2017,2,1–20
      47.542313,7.590187,Pfeffingerstrasse 85,Immro AG,31.03.2018,12,1–20
      47.554813,7.575178,Rudolfstrasse 25,Erbengemeinschaft Klauser,31.7.2019,10,1–20
      47.560207,7.570892,Bartenheimerstrasse ,Gilbert & Pascal Spaini,,10,1–20
      47.565749,7.562924,Markircherstrasse ,Monika Lichtensteiger,30.06.2018,10,1–20
      47.560668,7.568914,Rixheimerstrasse 14,Immo Timus AG,30.09.2018,12,1–20
      47.568739,7.574262,Gassstrasse 66 - 68,Diverse/ Stockwerkeigentum,,2,1–20
      47.568609,7.569478,Flughafenstrasse 63,Horlacher Immobilien AG,31.03.2019,8,1–20
      47.562485,7.574132,Kannenfeldstrasse 12,Breel Donald Embolo,31.03.2019,14,1–20
      47.563143,7.573606,Kannenfeldstrasse ,Marcel René Rutishauser,31.03.2018,14,1–20
      47.568335,7.576734,Landskronstrasse ,Cubus AG,30.09.2017,18,1–20
      47.569942,7.575843,Lothringerstrasse ,Seelicht AG,31.03.2021,40,21–40
      47.563767,7.574589,Sommergasse ,Ann Lapping & Ulrich Ramseier,28.02.2019,10,1–20
      47.568284,7.578354,Ryffstrasse 19 - 23,Dürig Immobilien AG,30.09.2019,32,21–40
      47.568592,7.59183,Bläsiring ,STP Immobilien AG,28.02.2019,20,1–20
      47.568694,7.595698,Bläsiring 150-160,Bellerive-Immobilien AG,,6,1–20
      47.571249,7.591017,"Erikastrasse 6, 7, 9",BEM Property Group AG,30.11.2018,30,21–40
      47.579934,7.590108,Giessliweg 60–66,Finanz und Treuhand AG,,30,21–40
      47.566356,7.595584 ,Haltingerstrasse 75,Beni Rosengarten,31.03.2018,12,1–20
      47.565453 ,7.591436,Haltingerstrasse 5,Credit Suisse Anlagestiftung RES Residential,31.03.2019,30,21–40
      47.568916,7.594757 ,Hammerstrasse 163,"Peter Weyn Banningh, Thierry Wilhelm",31.03.2019,22,21–40
      47.577452,7.589942 ,Inselstrasse 55,Pensionskasse SBB,31.07.2019,16,1–20
      47.564395,7.595858,Klingentalstrasse 53,Esther Storz & Kons,,10,1–20
      47.565911,7.594091,Mörsbergerstrasse ,Pensionskasse SBB,,16,1–20
      47.565685,7.591381,Klybeckstrasse 62,MKD Swiss Immo AG,30.11.2019,10,1–20
      47.569268,7.596935,Amerbachstrasse 100–104,Avadis Anlagestiftung,31.03.2019,14,1–20
      47.567527,7.59706 , Feldbergstrasse 137,GAM Investment Management,31.05.2019,62,61–80
      47.559657,7.600773,Rheinfelderstrasse 35-43,Christoph Merian Stiftung,28.02.2019,60,41–60
      47.570462,7.611158,Schorenweg 20/22 und 30/32,SIAT Immobilien Fonds,31.3.2020/30.4.2021,196,80+
      47.562456,7.592042,Webergasse 35,Mat-Hadar AG,,18,1–20
      `.trim()}
    />
    <P>
      Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
      commodo ligula eget dolor. Aenean massa. Cum sociis natoque
      penatibus et magnis dis parturient montes, nascetur ridiculus
      mus. Donec quam felis, ultricies nec, pellentesque eu, pretium
      quis, sem. Nulla consequat massa quis enim. Donec pede justo,
      fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo,
      rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum
      felis eu pede mollis pretium. Integer tincidunt. Cras dapibus.
      Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.
      Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac,
      enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a,
      tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque
      rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue.
    </P>
  </Center>
))
