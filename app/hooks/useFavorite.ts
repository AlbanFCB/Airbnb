import axios from 'axios';
import { useRouter } from 'next/navigation';
import { SafeUser } from '@/app/types';
import useLoginModal from './useLoginModal';
import { useMemo } from 'react';
import { useCallback } from 'react';
import { toast } from 'react-hot-toast';

interface UseFavoriteProps {
    listingId: string;
    currentUser?: SafeUser | null;
}

const useFavorite = ({
    listingId,
    currentUser
}: UseFavoriteProps) => {
    const router = useRouter();
    const loginModal = useLoginModal();

    const hasFavorited = useMemo(() => {
    const list = currentUser?.favoriteIds || [];

    return list.includes(listingId);
    }, [currentUser, listingId]);

    const toggleFavorite = useCallback(async (
        e: React.MouseEvent<HTMLDivElement>
    ) => {
        e.stopPropagation();

        if (!currentUser ) {
            return loginModal.onOpen();
        }

        try{
            let request;

            if (hasFavorited) {
                request = () => axios.delete(`/api/favorites/${listingId}`);
            } else {
                request = () => axios.post(`/api/favorites/${listingId}`);
            }
            await request();
            router.refresh();
            toast.success('Success');
        } catch (error) {
            toast.error('Something went wrong!')
        }
    }, [currentUser, hasFavorited, loginModal, listingId, router]);

    return {
        hasFavorited,
        toggleFavorite
    }
}

export default useFavorite;