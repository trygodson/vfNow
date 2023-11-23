import React, { useEffect, useRef, useState } from 'react';
import TopHeader from '../../components/BusinessHeader';
import BusinessElectionBox from '../../components/BusinessElectionBox';
import Loader from '../../components/Loader';
import { toPng } from 'html-to-image';
import { useTranslation } from 'react-i18next';
import '../../languages/i18n';
import API from '../../services/ApiLists';
import { ApiCall } from '../../services/ApiCall';
import { getUserData } from '../../Functions/Functions';

import {
  EmailShareButton,
  FacebookShareButton,
  FacebookIcon,
  HatenaShareButton,
  InstapaperShareButton,
  InstapaperIcon,
  LineShareButton,
  LinkedinShareButton,
  LinkedinIcon,
  LivejournalShareButton,
  MailruShareButton,
  OKShareButton,
  PinterestShareButton,
  PinterestIcon,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
  PocketShareButton,
  RedditShareButton,
  TelegramShareButton,
  TelegramIcon,
  TumblrShareButton,
  TwitterShareButton,
  TwitterIcon,
  ViberShareButton,
  VKShareButton,
  WhatsappShareButton,
  WhatsappIcon,
  WorkplaceShareButton,
} from 'react-share';
export const BusinessDetailsShareLink = ({ modalElection, shareFunc = () => null, setLoading }) => {
  const { t } = useTranslation();
  // console.log(shareImage, 'shareImage');
  return (
    <>
      <div class="ss-wrap">
        <div class="ss-encl">
          <div class="ss-row">
            <div class="ss-blk">
              {window?.isNative ? (
                <FacebookIcon
                  size={32}
                  round
                  onClick={() => {
                    window.ReactNativeWebView.postMessage(
                      JSON.stringify({
                        facebookStory: true,
                        data: {
                          name: modalElection?.business_name,
                          link: `www.voteandfun.com/businessDetailVisitor/${modalElection?.election_id}`,
                        },
                      }),
                    );
                  }}
                />
              ) : (
                <FacebookShareButton
                  // url={shareImage ?? ''}
                  url={`www.voteandfun.com/businessDetailVisitor/${modalElection?.election_id}`}
                  quote={'Vote and Fun Vote'}
                  hashtag={'#vote&fun'}
                  description={'aiueo'}
                  className="Demo__some-network__share-button"
                >
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
              )}
              <span>FACEBOOK</span>
            </div>
            <div class="ss-blk">
              {window?.isNative ? (
                <TelegramIcon
                  size={32}
                  round
                  onClick={() => {
                    window.ReactNativeWebView.postMessage(
                      JSON.stringify({
                        telegram: true,
                        data: {
                          name: modalElection?.business_name,
                          link: `www.voteandfun.com/businessDetailVisitor/${modalElection?.election_id}`,
                        },
                      }),
                    );
                  }}
                />
              ) : (
                <TelegramShareButton
                  url={`www.voteandfun.com/businessDetailVisitor/${modalElection?.election_id}`}
                  quote={'Vote and Fun Vote'}
                  hashtag={'#vote&fun'}
                  description={'aiueo'}
                  className="Demo__some-network__share-button"
                >
                  <TelegramIcon size={32} round />
                </TelegramShareButton>
              )}
              <span>TELEGRAM</span>
            </div>
            <div class="ss-blk">
              {window?.isNative ? (
                <InstapaperIcon
                  size={32}
                  round
                  onClick={() => {
                    window.ReactNativeWebView.postMessage(
                      JSON.stringify({
                        instagram: true,
                        data: {
                          name: modalElection?.business_name,
                          link: `www.voteandfun.com/businessDetailVisitor/${modalElection?.election_id}`,
                        },
                      }),
                    );
                  }}
                />
              ) : (
                <InstapaperShareButton
                  url={`www.voteandfun.com/businessDetailVisitor/${modalElection?.election_id}`}
                  quote={'Vote and Fun Vote'}
                  hashtag={'#vote&fun'}
                  description={'aiueo'}
                  className="Demo__some-network__share-button"
                >
                  <InstapaperIcon size={32} round />
                </InstapaperShareButton>
              )}
              <span>INSTAGRAM</span>
            </div>
            <div class="ss-blk">
              {window?.isNative ? (
                <LinkedinIcon
                  size={32}
                  round
                  onClick={() => {
                    window.ReactNativeWebView.postMessage(
                      JSON.stringify({
                        linkedin: true,
                        data: {
                          name: modalElection?.business_name,
                          link: `www.voteandfun.com/businessDetailVisitor/${modalElection?.election_id}`,
                        },
                      }),
                    );
                  }}
                />
              ) : (
                <LinkedinShareButton
                  url={`www.voteandfun.com/businessDetailVisitor/${modalElection?.election_id}`}
                  quote={'Vote and Fun Vote'}
                  hashtag={'#vote&fun'}
                  description={'aiueo'}
                  className="Demo__some-network__share-button"
                >
                  <LinkedinIcon size={32} round />
                </LinkedinShareButton>
              )}
              <span>LINKEDIN</span>
            </div>
            <div class="ss-blk">
              {window.isNative ? (
                <WhatsappIcon
                  size={32}
                  round
                  onClick={() => {
                    window.ReactNativeWebView.postMessage(
                      JSON.stringify({
                        whatsapp: true,
                        data: {
                          name: modalElection?.business_name,
                          link: `www.voteandfun.com/businessDetailVisitor/${modalElection?.election_id}`,
                        },
                      }),
                    );
                  }}
                />
              ) : (
                <WhatsappShareButton
                  url={`www.voteandfun.com/businessDetailVisitor/${modalElection?.election_id}`}
                  quote={'Vote and Fun Vote'}
                  hashtag={'#vote&fun'}
                  description={'aiueo'}
                  className="Demo__some-network__share-button"
                >
                  <WhatsappIcon size={32} round />
                </WhatsappShareButton>
              )}
              <span>Whatsapp</span>
            </div>
            <div class="ss-blk">
              {window?.isNative ? (
                <PinterestIcon
                  size={32}
                  round
                  onClick={() => {
                    window.ReactNativeWebView.postMessage(
                      JSON.stringify({
                        pinterest: true,
                        data: {
                          name: modalElection?.business_name,
                          link: `www.voteandfun.com/businessDetailVisitor/${modalElection?.election_id}`,
                        },
                      }),
                    );
                  }}
                />
              ) : (
                <PinterestShareButton
                  url={`www.voteandfun.com/businessDetailVisitor/${modalElection?.election_id}`}
                  quote={'Vote and Fun Vote'}
                  hashtag={'#vote&fun'}
                  description={'aiueo'}
                  className="Demo__some-network__share-button"
                >
                  <PinterestIcon size={32} round />
                </PinterestShareButton>
              )}
              <span>PINTEREST</span>
            </div>
          </div>
        </div>
      </div>
      <h6>{t('alert.Message it to your friend!')}</h6>
      <div class="ss-wrap">
        <div class="ss-encl">
          <div class="ss-row">
            <div class="ss-blk">
              {window.isNative ? (
                <WhatsappIcon
                  size={32}
                  round
                  onClick={() => {
                    window.ReactNativeWebView.postMessage(
                      JSON.stringify({
                        whatsapp: true,
                        data: {
                          name: modalElection?.business_name,
                          link: `www.voteandfun.com/businessDetailVisitor/${modalElection?.election_id}`,
                        },
                      }),
                    );
                  }}
                />
              ) : (
                <WhatsappShareButton
                  url={`www.voteandfun.com/businessDetailVisitor/${modalElection?.election_id}`}
                  quote={'Vote and Fun Vote'}
                  hashtag={'#vote&fun'}
                  description={'aiueo'}
                  className="Demo__some-network__share-button"
                >
                  <WhatsappIcon size={32} round />
                </WhatsappShareButton>
              )}
              <span>WHATSAPP</span>
            </div>
            <div class="ss-blk">
              {window?.isNative ? (
                <TelegramIcon
                  size={32}
                  round
                  onClick={() => {
                    window.ReactNativeWebView.postMessage(
                      JSON.stringify({
                        telegram: true,
                        data: {
                          name: modalElection?.business_name,
                          link: `www.voteandfun.com/businessDetailVisitor/${modalElection?.election_id}`,
                        },
                      }),
                    );
                  }}
                />
              ) : (
                <TelegramShareButton
                  url={`www.voteandfun.com/businessDetailVisitor/${modalElection?.election_id}`}
                  quote={'Vote and Fun Vote'}
                  hashtag={'#vote&fun'}
                  description={'aiueo'}
                  className="Demo__some-network__share-button"
                >
                  <TelegramIcon size={32} round />
                </TelegramShareButton>
              )}
              <span>TELEGRAM</span>
            </div>

            <div class="ss-blk">
              {window.isNative ? (
                <FacebookMessengerIcon
                  size={32}
                  round
                  onClick={() => {
                    window.ReactNativeWebView.postMessage(
                      JSON.stringify({
                        messenger: true,
                        data: {
                          name: modalElection?.business_name,
                          link: `www.voteandfun.com/businessDetailVisitor/${modalElection?.election_id}`,
                        },
                      }),
                    );
                  }}
                />
              ) : (
                <FacebookMessengerShareButton
                  url={`www.voteandfun.com/businessDetailVisitor/${modalElection?.election_id}`}
                  quote={'Vote and Fun Vote'}
                  hashtag={'#vote&fun'}
                  description={'aiueo'}
                  className="Demo__some-network__share-button"
                >
                  <FacebookMessengerIcon size={32} round />
                </FacebookMessengerShareButton>
              )}
              <span>MESSANGER</span>
            </div>
          </div>
        </div>
      </div>

      <h6>{t('alerts.Message it to your friend in VOTE and FUN!')}</h6>
      <div class="ss-wrap">
        <div class="ss-encl">
          <div class="ss-row">
            <div class="ss-blk">
              <img class="vf-ico" src="images/btn-vote-fun-ico.png" alt="ico" />
              <span>{t('alerts.A SINGLE FRIEND')}</span>
            </div>
            <div class="ss-blk">
              <img class="vf-ico" src="images/btn-vote-fun-ico.png" alt="ico" />
              <span>{t('alerts.ALL FRIENDS')}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
