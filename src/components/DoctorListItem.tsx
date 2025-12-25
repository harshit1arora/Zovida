import { Doctor } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Clock, Video, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface DoctorListItemProps {
  doctor: Doctor;
  index: number;
  onConsult: (doctor: Doctor) => void;
}

const DoctorListItem = ({ doctor, index, onConsult }: DoctorListItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card variant="interactive">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 text-2xl font-bold text-primary">
              {doctor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground">{doctor.name}</h4>
              <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
              
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="text-trust fill-trust" size={14} />
                  <span className="text-sm font-medium">{doctor.rating}</span>
                  <span className="text-xs text-muted-foreground">({doctor.reviewCount})</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock size={14} />
                  <span className="text-xs">
                    {doctor.available ? 'Available now' : 'Busy'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="flex flex-col items-end justify-between">
              <span className="text-sm font-bold text-foreground">
                ${doctor.consultationFee}
              </span>
              <div className="flex flex-col gap-2 mt-2">
                <Button
                  variant={doctor.available ? 'default' : 'secondary'}
                  size="sm"
                  disabled={!doctor.available}
                  onClick={() => onConsult(doctor)}
                  className="h-8 text-[10px] px-2"
                >
                  <Video size={12} className="mr-1" />
                  Share Safety Report
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`https://www.google.com/maps/search/hospitals+near+me`, '_blank')}
                  className="h-8 text-[10px] px-2 border-primary/20 text-primary hover:bg-primary/5"
                >
                  <MapPin size={12} className="mr-1" />
                  Locate Nearby Clinics
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DoctorListItem;
