import { RingLoader, PulseLoader } from 'react-spinners';

const LoadingScreen = () => (
    <div className="d-flex justify-content-center align-items-center pb-5" style={{ height: '80vh' }}>
        <div className="text-center mt-5">
            <div className="mb-5">
                <RingLoader color="red" size={200} />
            </div>
            <div className="my-5">
                <p className="mt-5 h3 text-secondary">Loading</p>
                <PulseLoader color="gray" size={10} />
            </div>
            
        </div>
    </div>
);

export default LoadingScreen;