<?php

namespace Tests;

use OlegV\Cliche\SomeClass;
use PHPUnit\Framework\TestCase;

class SomeTest extends TestCase
{
    /**
     * @return void
     */
    public function testSomeClass(): void
    {
        $this->assertEquals('test', (new SomeClass())('test'));
    }
}