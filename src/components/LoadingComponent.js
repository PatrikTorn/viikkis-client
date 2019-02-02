import React from 'react';
import Loader from 'react-loader-spinner';

export const LoadingComponent = () => {
    return (
        <div style={styles.loader}>
            <div style={styles.container}>
                <h1 style={styles.text}>Ladataan...</h1>
                <Loader
                    type="Puff"
                    color="#00BFFF"
                    height="100"
                    width="100"
                />
            </div>
        </div>
    )
}

const styles = {
    loader: {
        zIndex: 10000,
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white'
    },
    container: { backgroundColor: 'rgba(0,0,0,0.5)', padding: 40, display: 'flex', justifyContent: 'center', alignItems: 'center' },
    text: { color: 'white' }
}