import React from 'react';
import ReactPdf, {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  PDFViewer,
  PDFDownloadLink,
  Font,
  Svg,
  Path,
  G,
  Polygon,
} from '@react-pdf/renderer';
import gg from '../images/pdf-top-img.png';
import bb from '../images/vf-pdf-logo.png';
import co from '../images/cate-rest-ico.png';
import robotoRegular from '../fonts/Roboto-Regular.ttf';
import robotoBold from '../fonts/Roboto-Bold.ttf';
import robotoBlack from '../fonts/Roboto-Black.ttf';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

const StarIcon = ({ color }) => {
  return (
    <Svg
      version="1.0"
      id="Layer_1"
      width="14px"
      height="14px"
      viewBox="0 0 64 64"
      enable-background="new 0 0 64 64"
      style={{ marginRight: 2 }}
    >
      <Path
        fill={color ?? '#D3D3D3'}
        d="M63.893,24.277c-0.238-0.711-0.854-1.229-1.595-1.343l-19.674-3.006L33.809,1.15
	C33.479,0.448,32.773,0,31.998,0s-1.48,0.448-1.811,1.15l-8.815,18.778L1.698,22.935c-0.741,0.113-1.356,0.632-1.595,1.343
	c-0.238,0.71-0.059,1.494,0.465,2.031l14.294,14.657L11.484,61.67c-0.124,0.756,0.195,1.517,0.822,1.957
	c0.344,0.243,0.747,0.366,1.151,0.366c0.332,0,0.666-0.084,0.968-0.25l17.572-9.719l17.572,9.719c0.302,0.166,0.636,0.25,0.968,0.25
	c0.404,0,0.808-0.123,1.151-0.366c0.627-0.44,0.946-1.201,0.822-1.957l-3.378-20.704l14.294-14.657
	C63.951,25.771,64.131,24.987,63.893,24.277z"
      />
    </Svg>
  );
};
const DollarIcon = ({ color }) => {
  return (
    <Svg width="14px" height="14px" viewBox="0 0 24 24" fill="none">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C17.1086 21.25 21.25 17.1086 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75ZM1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM12 5.25C12.4142 5.25 12.75 5.58579 12.75 6V6.31673C14.3804 6.60867 15.75 7.83361 15.75 9.5C15.75 9.91421 15.4142 10.25 15 10.25C14.5858 10.25 14.25 9.91421 14.25 9.5C14.25 8.82154 13.6859 8.10339 12.75 7.84748V11.3167C14.3804 11.6087 15.75 12.8336 15.75 14.5C15.75 16.1664 14.3804 17.3913 12.75 17.6833V18C12.75 18.4142 12.4142 18.75 12 18.75C11.5858 18.75 11.25 18.4142 11.25 18V17.6833C9.61957 17.3913 8.25 16.1664 8.25 14.5C8.25 14.0858 8.58579 13.75 9 13.75C9.41421 13.75 9.75 14.0858 9.75 14.5C9.75 15.1785 10.3141 15.8966 11.25 16.1525V12.6833C9.61957 12.3913 8.25 11.1664 8.25 9.5C8.25 7.83361 9.61957 6.60867 11.25 6.31673V6C11.25 5.58579 11.5858 5.25 12 5.25ZM11.25 7.84748C10.3141 8.10339 9.75 8.82154 9.75 9.5C9.75 10.1785 10.3141 10.8966 11.25 11.1525V7.84748ZM12.75 12.8475V16.1525C13.6859 15.8966 14.25 15.1785 14.25 14.5C14.25 13.8215 13.6859 13.1034 12.75 12.8475Z"
        fill="#1C274C"
      />
    </Svg>
  );
};
const ShipIcon = ({ color }) => {
  return (
    <Svg
      height="14px"
      width="14px"
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 358.21 358.21"
    >
      <G>
        <G>
          <Path
            fill="#010002"
            d="M350.081,60.448H8.129C3.642,60.448,0,64.09,0,68.577v44.48c0,4.487,3.642,8.129,8.129,8.129
			h13.485v168.448c0,4.495,3.642,8.129,8.129,8.129h298.725c4.495,0,8.129-3.633,8.129-8.129V121.185h13.485
			c4.495,0,8.129-3.642,8.129-8.129v-44.48C358.21,64.09,354.577,60.448,350.081,60.448z M320.339,281.505H37.871v-160.32h282.468
			V281.505z M341.953,104.928h-13.485H29.742H16.257V76.705h325.696C341.953,76.705,341.953,104.928,341.953,104.928z"
          />
          <Polygon
            fill="#010002"
            points="133.544,255.965 178.024,211.477 222.503,255.965 233.997,244.471 189.518,199.983 
			233.997,155.512 222.503,144.018 178.024,188.489 133.544,144.018 122.051,155.512 166.53,199.983 122.051,244.471"
          />
        </G>
      </G>
    </Svg>
  );
};

const FiveStars = ({ rating }) => {
  return (
    <>
      <StarIcon color={rating >= 1 ? '#ffd306' : null} />
      <StarIcon color={rating >= 2 ? '#ffd306' : null} />
      <StarIcon color={rating >= 3 ? '#ffd306' : null} />
      <StarIcon color={rating >= 4 ? '#ffd306' : null} />
      <StarIcon color={rating >= 5 ? '#ffd306' : null} />
    </>
  );
};

// export default StarIcon;

Font.register({
  family: 'Roboto',
  fonts: [
    { src: robotoRegular, fontWeight: 'regular' },
    { src: robotoBold, fontWeight: 'bold' },
    { src: robotoBlack, fontWeight: 'heavy' },
  ],
});
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  section: {},
});

export const PdfExportFormat = ({ election, electionQR }) => {
  const { t } = useTranslation();
  return (
    <Document style={{ height: '100%' }}>
      <Page size="A4" style={styles.page}>
        <View style={{ position: 'relative', height: '40%', width: '100%' }}>
          <Image
            source={gg}
            style={{
              // width: '100%',
              height: '100%',
            }}
          />
        </View>
        <View
          style={{
            width: '75%',
            height: '36%',
            alignItems: 'center',
            marginVertical: 0,
            marginTop: '-22%',
            marginHorizontal: 'auto',
            borderBottomWidth: 3,
            borderBottomColor: '#dddddd',
          }}
        >
          <View style={{ width: '76%', height: '100%' }}>
            <View
              style={{
                position: 'relative',
                zIndex: 3,
                // top: '63%',
                width: '100%',
                // borderColor: 'red',
                // borderWidth: 1,
                alignItems: 'flex-start',
                marginBottom: 20,
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: '#000000',
                  }}
                >
                  <Image
                    style={{
                      width: 42,
                      height: 42,
                      marginLeft: 3.5,
                      borderRadius: 21,
                      objectFit: 'cover',
                      marginRight: 5,
                      borderColor: 'red',
                      borderWidth: 2,
                    }}
                    source={
                      election?.business_details?.avatar
                        ? {
                            uri: election?.business_details?.avatar,
                          }
                        : co
                    }
                  />
                </View>
                <View style={{ justifyContent: 'center', marginTop: 5, marginLeft: 7 }}>
                  <Text style={{ fontSize: 14, fontFamily: 'Roboto', fontWeight: 'heavy', textTransform: 'uppercase' }}>
                    {election?.business_name}
                  </Text>
                  <View style={{ flexDirection: 'row', marginTop: 3 }}>
                    <FiveStars rating={parseInt(election?.ratings ?? 0)} />
                  </View>
                </View>
              </View>
            </View>
            <View style={{ width: '100%', height: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Image
                style={{ width: '73%', height: '100%', objectFit: 'cover' }}
                source={{
                  uri: election?.gift_images[0].picture,
                }}
              />
              <View style={{ width: '25%', height: '100%' }}>
                {election?.gift_images &&
                  election.gift_images.map((item, idx) => {
                    return (
                      <Image
                        key={idx}
                        style={{ width: '100%', height: '23%', marginBottom: 3, objectFit: 'cover' }}
                        source={{
                          uri: item?.picture,
                        }}
                      />
                    );
                  })}
              </View>
            </View>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
              <Text style={{ fontSize: 14 }}>{election?.gift_title}</Text>
              <Text style={{ fontSize: 10 }}>({election?.unique_number})</Text>
            </View>
          </View>
        </View>

        <View
          style={{
            width: '75%',
            height: '10%',
            alignItems: 'center',
            marginTop: 10,
            marginBottom: 5,
            marginHorizontal: 'auto',
            borderBottomWidth: 3,
            borderBottomColor: '#dddddd',
          }}
        >
          <View style={{ width: '76%', height: '100%' }}>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <View style={{ flexDirection: 'row' }}>
                <DollarIcon style={{}} />
                <Text style={{ fontSize: 13, marginLeft: 5 }}>
                  {election?.gift_value} {election?.currency}
                </Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <ShipIcon style={{}} />
                <Text style={{ fontSize: 13, marginLeft: 5 }}>
                  {election?.gift_delivery_option?.value == '1'
                    ? t('election.Shipped')
                    : election?.gift_delivery_option?.value == '2'
                    ? t('election.On-line delivery')
                    : t('election.At the place')}
                </Text>
              </View>
            </View>
            <View style={{ marginHorizontal: 'auto' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ fontSize: 14, marginRight: 10, fontFamily: 'Roboto', fontWeight: 'bold' }}>
                  Start Date
                </Text>
                <Text style={{ fontSize: 12 }}>{election?.election_duration}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 14, marginRight: 10, fontFamily: 'Roboto', fontWeight: 'bold' }}>
                  End Date
                </Text>

                <Text style={{ fontSize: 14 }}>{election?.election_date} </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            width: '75%',
            height: '25%',
            alignItems: 'center',
            marginTop: 5,
            marginHorizontal: 'auto',
          }}
        >
          <Text style={{ fontSize: 20, fontFamily: 'Roboto', fontWeight: 'bold' }}>
            Scan the QR Code to collect lots of votes...
          </Text>
          <Text style={{ fontSize: 20, fontFamily: 'Roboto', fontWeight: 'bold' }}>...and win gift</Text>

          <View style={{ width: '35%', height: '75%', marginHorizontal: 'auto', marginTop: 3 }}>
            <Image
              source={{
                uri: 'data:image/png;base64,' + electionQR?.qr_image,
              }}
            />
          </View>
        </View>

        <Image
          source={bb}
          style={{
            // width: '100%',
            position: 'absolute',
            bottom: 30,
            left: 30,
            height: 50,
          }}
        />
      </Page>
    </Document>
  );
};
