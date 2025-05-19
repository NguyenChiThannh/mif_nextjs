import { GROUP_STATUS } from '@/hooks/useGroupStatus';

export const checkGroupAccess = (group, status) => {
    return group.isPublic || status === GROUP_STATUS.JOINED;
};

export const checkSectionAccess = (section = 'feed', status, isOwner, isPublic) => {
    const publicSections = ['about'];
    if (publicSections.includes(section)) {
        return true;
    }

    const viewableSections = ['feed', 'members', 'rules'];
    if (isPublic && viewableSections.includes(section)) {
        return true;
    }

    const memberSections = ['feed', 'members', 'events', 'rules'];
    if (memberSections.includes(section)) {
        return status === GROUP_STATUS.JOINED || isOwner;
    }

    return isOwner;
};

export const canCreatePost = (status, isOwner) => {
    return status === GROUP_STATUS.JOINED || isOwner;
}; 