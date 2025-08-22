import { differenceInYears, format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (dateString: string, formatStr: string = 'dd/MM/yyyy'): string => {
  try {
    const date = parseISO(dateString);
    return format(date, formatStr, { locale: es });
  } catch (error) {
    return dateString;
  }
};

export const calculateAge = (birthDate: string): number => {
  try {
    const birth = parseISO(birthDate);
    return differenceInYears(new Date(), birth);
  } catch (error) {
    return 0;
  }
};

export const formatDateForInput = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'yyyy-MM-dd');
  } catch (error) {
    return '';
  }
};

export const isValidDate = (dateString: string): boolean => {
  try {
    const date = parseISO(dateString);
    return !isNaN(date.getTime());
  } catch (error) {
    return false;
  }
};

export const isFutureDate = (dateString: string): boolean => {
  try {
    const date = parseISO(dateString);
    return date > new Date();
  } catch (error) {
    return false;
  }
};
