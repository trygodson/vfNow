// let baseUrl = "http://54.255.52.195";
let baseUrl = 'https://apis.voteandfun.com';
const apiCalls = {
  UpdateDeviceToken: baseUrl + '/api/device-token/update',

  TrackApp: baseUrl + '/api/track/connection',
  VisitorLoginApi: baseUrl + '/api/login/visitor',
  SignInApi: baseUrl + '/api/login/email',
  facebookApi: baseUrl + '/api/login/facebook',
  googleApi: baseUrl + '/api/login/google',
  userRegisterApi: baseUrl + '/api/register/user',
  businessRegisterApi: baseUrl + '/api/register/business',
  businessDetailApi: baseUrl + '/api/update/business/details',
  businessReclaimApi: baseUrl + '/api/business/reclaim',
  businesshoursApi: baseUrl + '/api/update/business/hours',
  businesscurrentlocationApi: baseUrl + '/api/update/business/address',
  businessimagesApi: baseUrl + '/api/update/business-place/images',
  businessPreviewApi: baseUrl + '/api/business/details',
  categoryBusinessListApi: baseUrl + '/api/business/category/list',
  categoryListApi: baseUrl + '/api/category/list',
  categoryListApi2: baseUrl + '/api/elecion/category/list',
  winnerListApi: baseUrl + '/api/winners/list',
  searchApi: baseUrl + '/api/search',
  searchHistoryApi: baseUrl + '/api/search/history',
  SCANAPI: baseUrl + '/api/scan/qr-code',
  SCANWinnerAPI: baseUrl + '/api/business/gift/scan/qr-code',
  categoryElections: baseUrl + '/api/elections/list',

  electiondetailhApi: baseUrl + '/api/election/details',
  electionEndedRequestApi: baseUrl + '/api/ended-election/restart/request',
  electionstartApi: baseUrl + '/api/election/start/again',
  electionDeleteApi: baseUrl + '/api/elections/delete',
  electionQRcodeApi: baseUrl + '/api/election/qr-code',
  AddelectionApi: baseUrl + '/api/add/new/election',
  UpdateelectionApi: baseUrl + '/api/update/election/details',
  ElectionListApi: baseUrl + '/api/business/elections/list',
  ElectionShareListApi: baseUrl + '/api/share/elections/list',
  feedbackApi: baseUrl + '/api/business/feedback',
  replyFeedbackapi: baseUrl + '/api/business/reply/feedback',
  placeImagesApi: baseUrl + '/api/business-place/images',
  BusinessQR: baseUrl + '/api/business/qr-code',
  BusinessFreindsList: baseUrl + '/api/business/friend/list',
  BusinessrequestElection: baseUrl + '/api/business/request/election',
  VoteHistory: baseUrl + '/api/votes',

  BusinessPurchaseCalculate: baseUrl + '/api/business/purchase/vf/calculate',
  BusinessCategoryViewApi: baseUrl + '/api/business/vf/filter',
  BusinessOutstanding: baseUrl + '/api/business/outstanding/payment',
  BusinessPurchasePayment: baseUrl + '/api/business/proceed/payment',

  BusinessGiftOnline: baseUrl + '/api/business/confirm/gift/online',
  BusinessGiftShippedAddress: baseUrl + '/api/business/gift/shipped/address',
  BusinessGiftShippedConfirmed: baseUrl + '/api/business/confirm/gift/shipped',

  userProfileApi: baseUrl + '/api/user/page',
  UpdateuserProfileApi: baseUrl + '/api/modify/user/details',
  userViewApi: baseUrl + '/api/view/user',
  usercollectGifts: baseUrl + '/api/user/collect/gifts',
  usercollectGiftsEMail: baseUrl + '/api/user/collect/gift/email',
  userFeedback: baseUrl + '/api/user/feedback',
  userrecieveGift: baseUrl + '/api/user/gift/confirm',
  addAddressGift: baseUrl + '/api/user/gift/add/address',
  addFeedbackGift: baseUrl + '/api/add/feedback',
  shipmentStatusGift: baseUrl + '/api/user/gift/shipment/status',
  UserQR: baseUrl + '/api/user/qr-code',
  AskforVoteApi: baseUrl + '/api/ask/vote',
  UserFavListApi: baseUrl + '/api/users/favourite/list',
  AddfavElectionApi: baseUrl + '/api/favourite/election',
  AddfavBusinessApi: baseUrl + '/api/favourite/business',
  userFriendlistApi: baseUrl + '/api/users/friend/list',
  userFriendChatmessageApi: baseUrl + '/api/chat/messages',
  userReadmessageApi: baseUrl + '/api/read/chat/messages',
  DeletemessageApi: baseUrl + '/api/delete/chat/messages',
  reportChatApi: baseUrl + '/api/user/reports',
  userFriendchatSendApi: baseUrl + '/api/chat/send',
  userchatSendCandidateApi: baseUrl + '/api/chat/all/candidates',

  AddElectionCandidateApi: baseUrl + '/api/join/election/candidate',
  removeElectionCandidateApi: baseUrl + '/api/remove/election/candidate',

  HomestartingSoonApi: baseUrl + '/api/starting-soon',
  HomejustAddedApi: baseUrl + '/api/just-added',
  HomebestShopApi: baseUrl + '/api/best-shop',

  MapElectionsApi: baseUrl + '/api/map/elections',
  MapBusinessApi: baseUrl + '/api/map/business',

  VisitorVoteAddApi: baseUrl + '/api/add/election/vote',
  GiveVoteDetailApi: baseUrl + '/api/election/vote/details',
  VisitorVoteRankApi: baseUrl + '/api/election/vote/ranking/details',
  VisitorVoteUserApi: baseUrl + '/api/view/user',
  RegionApi: baseUrl + '/api/region',
  CitiesApi: baseUrl + '/api/cities',
  ForgotPasswordUserApi: baseUrl + '/api/forgot/password',
  BusinessModifyApi: baseUrl + '/api/modify/business/details',

  BusinessRegEmailVerifyCheckApi: baseUrl + '/api/user/email/confirm-status',
  BusinessRegSendEmailAgainApi: baseUrl + '/api/user/send/email-again',
};

export default apiCalls;
