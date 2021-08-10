import {useTransition} from 'react';
import {useLocation} from './LocationContext.client';

export default function Left({text}) {
    const [location, setLocation] = useLocation();
    const [, startTransition] = useTransition();

    let idNext = location.selectedId + 1;

    return (
        <div className="left">
            <p>id={location.selectedId}</p>
            <button
                onClick={() => {
                    setLocation((loc) => ({
                        selectedId: idNext,
                        isEditing: false,
                        searchText: loc.searchText,
                    }));
                }}>
                Next id={idNext}
            </button>
            <button
                onClick={() => {
                    startTransition(() => {
                        setLocation((loc) => ({
                            selectedId: idNext,
                            isEditing: false,
                            searchText: loc.searchText,
                        }));
                    });
                }}>
                Next id={idNext} (Transition)
            </button>
            <p>{text}</p>
        </div>
    );
}