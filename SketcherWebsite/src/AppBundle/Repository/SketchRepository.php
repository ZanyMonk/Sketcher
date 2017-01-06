<?php

namespace AppBundle\Repository;

/**
 * SketchRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class SketchRepository extends \Doctrine\ORM\EntityRepository
{

    public function getLastSketches($page, $number) {
        $manager = $this->getEntityManager();
        return $manager->getRepository('AppBundle:Sketch')
                       ->findBy(array(), array('dateUpload' => 'DESC'), $page * $number, $number);
    }

    public function getMostLikedSketches($page, $number) {
        $manager = $this->getEntityManager();

        $query = $manager->getRepository('AppBundle:Sketch')
                       ->createQueryBuilder('sketch')
                       ->leftJoin('sketch.likers', 'likers')
                       ->addSelect('COUNT(sketch.id) AS HIDDEN nbLikes')
                       ->orderBy('nbLikes', 'DESC')
                       ->groupBy('sketch.id')
                       ->setFirstResult($page * $number)
                       ->setMaxResults($number)
                       ->getQuery();


        return $query->execute();
    }

    public function getNb() {
        return $this->createQueryBuilder('Sketch')
                        ->select('COUNT(Sketch)')
                        ->getQuery()
                        ->getSingleScalarResult();
    }


}
