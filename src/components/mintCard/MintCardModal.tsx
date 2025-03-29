import React, { memo } from '../../lib/teact/teact';
import { getActions, withGlobal } from '../../global';

import type { ApiCardsInfo } from '../../api/types';
import type { HardwareConnectState, Theme } from '../../global/types';
import { MintCardState } from '../../global/types';

import { ANIMATED_STICKER_TINY_ICON_PX } from '../../config';
import renderText from '../../global/helpers/renderText';
import { selectCurrentAccountState } from '../../global/selectors';
import buildClassName from '../../util/buildClassName';
import resolveSlideTransitionName from '../../util/resolveSlideTransitionName';
import { ANIMATED_STICKERS_PATHS } from '../ui/helpers/animatedAssets';

import useAppTheme from '../../hooks/useAppTheme';
import useLang from '../../hooks/useLang';
import useLastCallback from '../../hooks/useLastCallback';
import useModalTransitionKeys from '../../hooks/useModalTransitionKeys';

import LedgerConfirmOperation from '../ledger/LedgerConfirmOperation';
import LedgerConnect from '../ledger/LedgerConnect';
import AnimatedIconWithPreview from '../ui/AnimatedIconWithPreview';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import ModalHeader from '../ui/ModalHeader';
import PasswordForm from '../ui/PasswordForm';
import Transition from '../ui/Transition';
import CardRoster from './CardRoster';

import modalStyles from '../ui/Modal.module.scss';
import styles from './MintCardModal.module.scss';

interface StateProps {
  isOpen: boolean;
  cardsInfo?: ApiCardsInfo;
  isLoading?: boolean;
  state?: MintCardState;
  error?: string;
  theme: Theme;
  hardwareState?: HardwareConnectState;
  isLedgerConnected?: boolean;
  isTonAppConnected?: boolean;
}

function MintCardModal({
  isOpen,
  cardsInfo,
  isLoading,
  state,
  error,
  theme,
  isLedgerConnected,
  isTonAppConnected,
  hardwareState,
} : StateProps) {
  const {
    closeMintCardModal, clearMintCardError, submitMintCard, submitMintCardHardware,
  } = getActions();

  const lang = useLang();
  const appTheme = useAppTheme(theme);
  const { renderingKey, nextKey } = useModalTransitionKeys(state ?? 0, isOpen);

  const handlePasswordSubmit = useLastCallback((password: string) => {
    submitMintCard({ password });
  });

  const handleHardwareSubmit = useLastCallback(() => {
    submitMintCardHardware();
  });

  function renderPasswordForm(isActive: boolean) {
    return (
      <>
        <ModalHeader title={lang('Enter Password')} onClose={closeMintCardModal} />
        <PasswordForm
          isActive={isActive}
          error={error}
          isLoading={isLoading}
          submitLabel={lang('Confirm')}
          cancelLabel={lang('Cancel')}
          onSubmit={handlePasswordSubmit}
          onCancel={closeMintCardModal}
          onUpdate={clearMintCardError}
        />
      </>
    );
  }

  function renderComplete(isActive: boolean) {
    return (
      <>
        <ModalHeader title={lang('Card has been upgraded!')} onClose={closeMintCardModal} />

        <div className={buildClassName(modalStyles.transitionContent, modalStyles.transitionContent_simple)}>
          <AnimatedIconWithPreview
            play={isActive}
            noLoop={false}
            nonInteractive
            className={styles.sticker}
            tgsUrl={ANIMATED_STICKERS_PATHS.thumbUp}
            previewUrl={ANIMATED_STICKERS_PATHS.thumbUpPreview}
          />

          <div className={buildClassName(styles.resultWithTime)}>
            <AnimatedIconWithPreview
              play={isActive}
              size={ANIMATED_STICKER_TINY_ICON_PX}
              className={styles.resultTimeIcon}
              nonInteractive
              noLoop={false}
              tgsUrl={ANIMATED_STICKERS_PATHS[appTheme].iconClockGray}
              previewUrl={ANIMATED_STICKERS_PATHS[appTheme].preview.iconClockGray}
            />
            <div>
              {renderText(lang('$mint_card_result'))}
            </div>
          </div>

          <div className={modalStyles.buttons}>
            <Button
              isPrimary
              className={modalStyles.buttonFullWidth}
              onClick={closeMintCardModal}
            >
              {lang('Done')}
            </Button>
          </div>
        </div>
      </>
    );
  }

  // eslint-disable-next-line consistent-return
  function renderContent(isActive: boolean, isFrom: boolean, currentKey: number) {
    switch (currentKey) {
      case MintCardState.Initial:
        return (<CardRoster cardsInfo={cardsInfo!} />);

      case MintCardState.Password:
        return renderPasswordForm(isActive);

      case MintCardState.ConnectHardware:
        return (
          <LedgerConnect
            isActive={isActive}
            state={hardwareState}
            isLedgerConnected={isLedgerConnected}
            isTonAppConnected={isTonAppConnected}
            onConnected={handleHardwareSubmit}
            onClose={closeMintCardModal}
          />
        );

      case MintCardState.ConfirmHardware:
        return (
          <LedgerConfirmOperation
            text={lang('Please confirm transaction on your Ledger')}
            error={error}
            onClose={closeMintCardModal}
            onTryAgain={handleHardwareSubmit}
          />
        );

      case MintCardState.Done:
        return renderComplete(isActive);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      forceFullNative
      nativeBottomSheetKey="mint-card"
      dialogClassName={styles.dialog}
      onClose={closeMintCardModal}
    >
      <Transition
        activeKey={renderingKey}
        nextKey={nextKey}
        name={resolveSlideTransitionName()}
        className={buildClassName(styles.transition, 'custom-scroll')}
        slideClassName={styles.transitionSlide}
      >
        {renderContent}
      </Transition>
    </Modal>
  );
}

export default memo(withGlobal((global): StateProps => {
  const { currentMintCard } = global;
  const { config } = selectCurrentAccountState(global) || {};
  const { cardsInfo } = config || {};
  const {
    hardwareState,
    isLedgerConnected,
    isTonAppConnected,
  } = global.hardware;

  return {
    isOpen: currentMintCard?.state !== undefined,
    cardsInfo,
    isLoading: currentMintCard?.isLoading,
    state: currentMintCard?.state,
    error: currentMintCard?.error,
    hardwareState,
    isLedgerConnected,
    isTonAppConnected,
    theme: global.settings.theme,
  };
})(MintCardModal));
