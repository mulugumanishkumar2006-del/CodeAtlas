'use client';

import * as React from 'react';

interface TourContextType {
                        isTourActive: boolean;
                        startTour: () => void;
                        stopTour: () => void;
}

const TourContext = React.createContext<TourContextType | undefined>(undefined);

export function TourProvider({ children }: { children: React.ReactNode }) {
                        const [isTourActive, setIsTourActive] = React.useState<boolean>(false);

                        const startTour = () => setIsTourActive(true);
                        const stopTour = () => setIsTourActive(false);

                        return (
                                                <TourContext.Provider
                                                                        value={{
                                                                                                isTourActive,
                                                                                                startTour,
                                                                                                stopTour,
                                                                        }}
                                                >
                                                                        {children}
                                                </TourContext.Provider>
                        );
}

export function useTour() {
                        const context = React.useContext(TourContext);
                        if (context === undefined) {
                                                throw new Error(
                                                                        'useTour must be used within a TourProvider'
                                                );
                        }
                        return context;
}
