import type { GlobalState } from './types';
import {
  AppState,
  AuthState,
  BiometricsState,
  SettingsState,
  StakingState,
  SwapState,
  TransferState,
} from './types';

import {
  ANIMATION_LEVEL_DEFAULT,
  DEFAULT_SLIPPAGE_VALUE,
  DEFAULT_STAKING_STATE,
  DEFAULT_TRANSFER_TOKEN_SLUG,
  INIT_SWAP_ASSETS,
  IS_CORE_WALLET,
  SHOULD_SHOW_ALL_ASSETS_AND_ACTIVITY,
  THEME_DEFAULT,
  TOKEN_INFO,
} from '../config';
import { IS_IOS_APP, USER_AGENT_LANG_CODE } from '../util/windowEnvironment';

export const STATE_VERSION = 36;

export const INITIAL_STATE: GlobalState = {
  appState: AppState.Auth,

  auth: {
    state: AuthState.none,
  },

  biometrics: {
    state: BiometricsState.None,
  },

  hardware: {},

  currentTransfer: {
    state: TransferState.None,
    tokenSlug: DEFAULT_TRANSFER_TOKEN_SLUG,
  },

  currentSwap: {
    state: SwapState.None,
    slippage: DEFAULT_SLIPPAGE_VALUE,
  },

  currentDappTransfer: {
    state: TransferState.None,
  },

  currentStaking: {
    state: StakingState.None,
  },

  stakingDefault: DEFAULT_STAKING_STATE,

  tokenInfo: {
    bySlug: TOKEN_INFO,
  },

  swapTokenInfo: {
    bySlug: INIT_SWAP_ASSETS,
  },

  tokenPriceHistory: {
    bySlug: {},
  },

  settings: {
    state: SettingsState.Initial,
    theme: THEME_DEFAULT,
    animationLevel: ANIMATION_LEVEL_DEFAULT,
    areTinyTransfersHidden: !SHOULD_SHOW_ALL_ASSETS_AND_ACTIVITY,
    canPlaySounds: true,
    langCode: USER_AGENT_LANG_CODE,
    byAccountId: {},
    areTokensWithNoCostHidden: !SHOULD_SHOW_ALL_ASSETS_AND_ACTIVITY,
    isSortByValueEnabled: true,
  },

  byAccountId: {},

  dialogs: [],
  notifications: [],

  stateVersion: STATE_VERSION,
  restrictions: {
    isLimitedRegion: false,
    isSwapDisabled: IS_IOS_APP || IS_CORE_WALLET,
    isOnRampDisabled: IS_IOS_APP || IS_CORE_WALLET,
    isNftBuyingDisabled: IS_IOS_APP,
  },

  mediaViewer: {},

  pushNotifications: {
    enabledAccounts: {},
  },
};
