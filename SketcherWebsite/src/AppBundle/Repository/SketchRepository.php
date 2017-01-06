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
                       ->select('sketch.id')
                       ->leftJoin('sketch.likers', 'likers')
                       ->addSelect('COUNT(sketch.id) AS nbLikes')
                       ->orderBy('nbLikes', 'DESC')
                       ->groupBy('sketch.id')
                       ->setFirstResult($page * $number)
                       ->setMaxResults($number)
                       ->getQuery();

        $result = $query->execute();

        $ids = array();
        foreach ($result as $row)
            $ids[] = $row["id"];



        return $manager->getRepository('AppBundle:Sketch')
                ->findBy(array('id' => $ids));
    }

    public function getNb() {
        return $this->createQueryBuilder('Sketch')
                        ->select('COUNT(Sketch)')
                        ->getQuery()
                        ->getSingleScalarResult();
    }


}
