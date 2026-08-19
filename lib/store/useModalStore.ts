"use client";

import { useSyncExternalStore } from "react";

export interface ConsultationModalOptions {
  source: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  customMessage?: string;
}

export interface QuizModalOptions {
  serviceContext?: string;
  source?: string;
}

export interface VideoModalOptions {
  videoUrl: string;
}

interface ModalState {
  consultation: {
    isOpen: boolean;
    options: ConsultationModalOptions;
  };
  quiz: {
    isOpen: boolean;
    options?: QuizModalOptions;
  };
  video: {
    isOpen: boolean;
    options: VideoModalOptions;
  };
}

const defaultState: ModalState = {
  consultation: {
    isOpen: false,
    options: {
      source: "Сайт",
    },
  },
  quiz: {
    isOpen: false,
  },
  video: {
    isOpen: false,
    options: {
      videoUrl: "",
    },
  },
};

let state: ModalState = defaultState;
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export const modalStore = {
  openConsultation(options: ConsultationModalOptions) {
    state = {
      ...state,
      consultation: {
        isOpen: true,
        options,
      },
    };
    emitChange();
  },

  closeConsultation() {
    state = {
      ...state,
      consultation: {
        ...state.consultation,
        isOpen: false,
      },
    };
    emitChange();
  },

  openQuiz(options?: QuizModalOptions) {
    state = {
      ...state,
      quiz: {
        isOpen: true,
        options,
      },
    };
    emitChange();
  },

  closeQuiz() {
    state = {
      ...state,
      quiz: {
        ...state.quiz,
        isOpen: false,
      },
    };
    emitChange();
  },

  openVideo(options: VideoModalOptions) {
    state = {
      ...state,
      video: {
        isOpen: true,
        options,
      },
    };
    emitChange();
  },

  closeVideo() {
    state = {
      ...state,
      video: {
        ...state.video,
        isOpen: false,
      },
    };
    emitChange();
  },

  closeAll() {
    state = defaultState;
    emitChange();
  },

  getSnapshot() {
    return state;
  },

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useModalStore() {
  const modalState = useSyncExternalStore(
    modalStore.subscribe,
    modalStore.getSnapshot,
    () => defaultState
  );

  return {
    ...modalState,
    openConsultation: modalStore.openConsultation,
    closeConsultation: modalStore.closeConsultation,
    openQuiz: modalStore.openQuiz,
    closeQuiz: modalStore.closeQuiz,
    openVideo: modalStore.openVideo,
    closeVideo: modalStore.closeVideo,
    closeAll: modalStore.closeAll,
  };
}
